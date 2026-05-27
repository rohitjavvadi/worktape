"use client";

import { useMemo, useState } from "react";
import { Copy, Download, MessageSquare, Plus, Save, Table2, Workflow } from "lucide-react";
import {
  firstEntity,
  type GeneratedRecord,
  type WorkflowEntity,
  type WorkflowField,
  type WorkflowSpec
} from "@/lib/workflow-spec";

type Props = {
  spec: WorkflowSpec;
  initialRecords: GeneratedRecord[];
};

function emptyValue(field: WorkflowField) {
  if (field.type === "boolean") return false;
  if (field.type === "number" || field.type === "currency") return "";
  if ((field.type === "select" || field.type === "status") && field.options?.length) {
    return field.options[0];
  }
  return "";
}

function valuesForEntity(entity: WorkflowEntity) {
  return Object.fromEntries(entity.fields.map((field) => [field.name, emptyValue(field)]));
}

const fieldAliases: Record<string, string[]> = {
  leadName: ["studentName", "name", "fullName"],
  studentName: ["leadName", "name", "fullName"],
  status: ["leadStatus", "admissionStatus"],
  leadStatus: ["status", "admissionStatus"],
  leadLabel: ["leadStatus", "label", "qualification"],
  payment: ["paymentStatus", "feeStatus"],
  paymentStatus: ["payment", "feeStatus"],
  followUp: ["followUpStatus", "nextFollowUp"],
  followUpStatus: ["followUp", "nextFollowUp"],
  lastMessage: ["notes", "message", "latestMessage"],
  notes: ["lastMessage", "message", "latestMessage"],
  batchPreference: ["batch", "batchTiming"],
  batch: ["batchPreference", "batchTiming"]
};

function normalizedKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function candidateKeys(field: WorkflowField) {
  return [field.name, field.label, ...(fieldAliases[field.name] || [])].map(normalizedKey);
}

function seedFallbackValue(field: WorkflowField, index: number) {
  const options = field.options || [];
  if ((field.type === "status" || field.type === "select") && options.length) {
    return options[index % options.length];
  }

  if (field.type === "phone") return ["+91 98765 43210", "+91 99887 77665", "+91 91234 56780"][index % 3];
  if (field.type === "number") return [16, 15, 13][index % 3];
  if (field.type === "currency") return ["25000", "18000", "30000"][index % 3];
  if (field.type === "date") return ["2026-05-27", "2026-05-28", "2026-05-29"][index % 3];
  if (field.type === "textarea") {
    return [
      "Parent asked for fee details and an evening batch.",
      "Wants a trial class before confirming.",
      "Confirmed for the weekend batch."
    ][index % 3];
  }

  const sampleByName: Record<string, string[]> = {
    leadname: ["Aarav Sharma", "Diya Patel", "Kabir Rao"],
    studentname: ["Aarav Sharma", "Diya Patel", "Kabir Rao"],
    name: ["Aarav Sharma", "Diya Patel", "Kabir Rao"],
    course: ["JEE", "NEET", "Foundation"],
    batch: ["Evening", "Morning", "Weekend"],
    batchpreference: ["Evening", "Morning", "Weekend"],
    followup: ["Today 5pm", "Tomorrow 11am", "Friday 2pm"]
  };

  return sampleByName[normalizedKey(field.name)]?.[index % 3] || "";
}

function valueFromSeed(seed: GeneratedRecord, field: WorkflowField) {
  const normalizedValues = Object.fromEntries(
    Object.entries(seed.values).map(([key, value]) => [normalizedKey(key), value])
  );
  const match = candidateKeys(field).find((key) => normalizedValues[key] !== undefined);
  return match ? normalizedValues[match] : undefined;
}

function adaptRecordsToSpec(entity: WorkflowEntity, initialRecords: GeneratedRecord[]) {
  const matchingRecords = initialRecords.filter(
    (record) => normalizedKey(record.entity) === normalizedKey(entity.name)
  );
  const sourceRecords = matchingRecords.length ? matchingRecords : initialRecords;

  return sourceRecords.slice(0, 3).map((record, index) => ({
    id: record.id || `${entity.name.toLowerCase()}-${index + 1}`,
    entity: entity.name,
    createdAt: record.createdAt,
    values: Object.fromEntries(
      entity.fields.map((field) => [
        field.name,
        valueFromSeed(record, field) ?? seedFallbackValue(field, index) ?? emptyValue(field)
      ])
    )
  }));
}

function fieldOptions(spec: WorkflowSpec, field: WorkflowField) {
  if (field.options?.length) return field.options;
  const status = spec.statuses.find((group) => group.name === field.name);
  return status?.values || [];
}

function renderTemplate(body: string, record: GeneratedRecord | undefined) {
  return body.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = record?.values[key];
    return value === undefined || value === "" ? `[${key}]` : String(value);
  });
}

function csvEscape(value: unknown) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function SpecDrivenTool({ spec, initialRecords }: Props) {
  const entity = firstEntity(spec);
  const seededRecords = useMemo(
    () => adaptRecordsToSpec(entity, initialRecords),
    [entity, initialRecords]
  );
  const [records, setRecords] = useState<GeneratedRecord[]>(
    seededRecords
  );
  const [draft, setDraft] = useState<Record<string, string | number | boolean>>(
    valuesForEntity(entity)
  );
  const [selectedRecordId, setSelectedRecordId] = useState(records[0]?.id || "");
  const [copiedTemplate, setCopiedTemplate] = useState("");
  const [error, setError] = useState("");
  const [copyError, setCopyError] = useState("");

  const selectedRecord = useMemo(
    () => records.find((record) => record.id === selectedRecordId) || records[0],
    [records, selectedRecordId]
  );

  function updateDraft(field: WorkflowField, value: string | boolean) {
    setDraft((current) => ({ ...current, [field.name]: value }));
  }

  function addRecord() {
    const missing = entity.fields.find((field) => {
      const value = draft[field.name];
      return field.required && (value === "" || value === null || value === undefined);
    });
    if (missing) {
      setError(`${missing.label} is required.`);
      return;
    }

    const record: GeneratedRecord = {
      id: `${entity.name.toLowerCase()}-${Date.now()}`,
      entity: entity.name,
      createdAt: new Date().toISOString(),
      values: draft
    };

    setRecords((current) => [record, ...current]);
    setSelectedRecordId(record.id);
    setDraft(valuesForEntity(entity));
    setError("");
  }

  function updateRecord(recordId: string, field: WorkflowField, value: string) {
    setRecords((current) =>
      current.map((record) =>
        record.id === recordId
          ? { ...record, values: { ...record.values, [field.name]: value } }
          : record
      )
    );
  }

  function exportCsv() {
    const header = entity.fields.map((field) => field.label);
    const rows = records.map((record) =>
      entity.fields.map((field) => csvEscape(record.values[field.name])).join(",")
    );
    const csv = [header.map(csvEscape).join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${entity.name.toLowerCase()}-export.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function copyTemplate(name: string, body: string) {
    const text = renderTemplate(body, selectedRecord);
    setCopyError("");
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const copied = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (!copied) {
        setCopyError("Copy failed. Select the message text and copy it manually.");
        return;
      }
    }
    setCopiedTemplate(name);
  }

  return (
    <section className="overflow-hidden rounded-[8px] border border-line bg-white shadow-soft">
      <div className="border-b border-line bg-[linear-gradient(135deg,#ffffff_0%,#eef7f3_55%,#eef2ff_100%)] px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-signal">
          Generated internal tool
        </p>
        <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-ink">{entity.label} workspace</h2>
            <p className="mt-1 max-w-3xl text-sm text-slate-600">
              This UI is rendered from the final spec: fields, statuses, templates, and CSV export
              come from JSON.
            </p>
          </div>
          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex items-center justify-center gap-2 rounded-[6px] bg-ink px-4 py-2 text-sm font-semibold text-white"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {[
            {
              label: "Records",
              value: records.length,
              detail: "Seeded and editable",
              icon: Table2
            },
            {
              label: "Fields",
              value: entity.fields.length,
              detail: "Mapped from spec",
              icon: Workflow
            },
            {
              label: "Statuses",
              value: spec.statuses.length,
              detail: "Controlled options",
              icon: Save
            },
            {
              label: "Templates",
              value: spec.messageTemplates.length,
              detail: "Copy to WhatsApp",
              icon: MessageSquare
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-[8px] border border-white/70 bg-white/75 p-3 shadow-sm">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                    {item.label}
                  </p>
                  <Icon size={15} className="text-slate-500" />
                </div>
                <p className="text-2xl font-semibold text-ink">{item.value}</p>
                <p className="text-xs font-medium text-slate-500">{item.detail}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[360px_1fr]">
        <form
          className="border-b border-line p-5 lg:border-b-0 lg:border-r"
          onSubmit={(event) => {
            event.preventDefault();
            addRecord();
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold">{spec.screens.find((s) => s.type === "form")?.name || "Intake form"}</h3>
            <Plus size={18} className="text-slate-500" />
          </div>
          <div className="space-y-3">
            {entity.fields.map((field) => {
              const options = fieldOptions(spec, field);
              return (
                <label key={field.name} className="block">
                  <span className="mb-1 block text-xs font-semibold text-slate-600">
                    {field.label}
                    {field.required ? " *" : ""}
                  </span>
                  {field.type === "textarea" ? (
                    <textarea
                      value={String(draft[field.name] || "")}
                      placeholder={field.placeholder}
                      onChange={(event) => updateDraft(field, event.target.value)}
                      className="min-h-20 w-full rounded-[6px] border border-line px-3 py-2 text-sm outline-none focus:border-cobalt"
                    />
                  ) : field.type === "select" || field.type === "status" ? (
                    <select
                      value={String(draft[field.name] || "")}
                      onChange={(event) => updateDraft(field, event.target.value)}
                      className="w-full rounded-[6px] border border-line bg-white px-3 py-2 text-sm outline-none focus:border-cobalt"
                    >
                      {options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "boolean" ? (
                    <input
                      type="checkbox"
                      checked={Boolean(draft[field.name])}
                      onChange={(event) => updateDraft(field, event.target.checked)}
                      className="h-4 w-4"
                    />
                  ) : (
                    <input
                      type={field.type === "number" || field.type === "currency" ? "number" : "text"}
                      value={String(draft[field.name] || "")}
                      placeholder={field.placeholder}
                      onChange={(event) => updateDraft(field, event.target.value)}
                      className="w-full rounded-[6px] border border-line px-3 py-2 text-sm outline-none focus:border-cobalt"
                    />
                  )}
                </label>
              );
            })}
          </div>
          {error ? <p className="mt-3 text-sm font-medium text-red-600">{error}</p> : null}
          <button
            type="submit"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[6px] bg-signal px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Save size={16} />
            Save {entity.label.toLowerCase()}
          </button>
        </form>

        <div className="min-w-0 p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold">{spec.screens.find((s) => s.type === "table")?.name || `${entity.label} dashboard`}</h3>
            <p className="text-sm text-slate-500">{records.length} records</p>
          </div>
          <div className="overflow-x-auto rounded-[8px] border border-line">
            <table className="w-full min-w-[860px] border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  {entity.fields.map((field) => (
                    <th key={field.name} className="border-b border-line px-3 py-3">
                      {field.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr
                    key={record.id}
                    onClick={() => setSelectedRecordId(record.id)}
                    className={record.id === selectedRecord?.id ? "bg-emerald-50/60" : "bg-white"}
                  >
                    {entity.fields.map((field) => {
                      const options = fieldOptions(spec, field);
                      const value = record.values[field.name];
                      return (
                        <td key={field.name} className="border-b border-line px-3 py-2 align-top">
                          {field.type === "status" && options.length ? (
                            <select
                              value={String(value || options[0])}
                              onChange={(event) => updateRecord(record.id, field, event.target.value)}
                              onClick={(event) => event.stopPropagation()}
                              className="rounded-full border border-line bg-white px-2 py-1 text-xs font-semibold text-slate-700"
                            >
                              {options.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-slate-700">{String(value ?? "")}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {!records.length ? (
                  <tr>
                    <td colSpan={entity.fields.length} className="px-3 py-10 text-center text-sm text-slate-500">
                      No records yet. Add the first {entity.label.toLowerCase()} from the generated form.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          {spec.messageTemplates.length ? (
            <div className="mt-5">
              <h3 className="mb-3 text-base font-semibold">
                {spec.screens.find((screen) => screen.type === "templates")?.name || "Message templates"}
              </h3>
              <div className="grid gap-3 md:grid-cols-3">
                {spec.messageTemplates.map((template) => (
                  <div key={template.name} className="rounded-[8px] border border-line p-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold">{template.name}</p>
                      <button
                        type="button"
                        onClick={() => copyTemplate(template.name, template.body)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] border border-line text-slate-600 hover:bg-slate-50"
                        aria-label={`Copy ${template.name}`}
                      >
                        <Copy size={15} />
                      </button>
                    </div>
                    <p className="text-xs leading-5 text-slate-600">
                      {renderTemplate(template.body, selectedRecord)}
                    </p>
                    {copiedTemplate === template.name ? (
                      <p className="mt-2 text-xs font-semibold text-signal">Copied</p>
                    ) : null}
                  </div>
                ))}
              </div>
              {copyError ? <p className="mt-3 text-sm font-medium text-red-600">{copyError}</p> : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
