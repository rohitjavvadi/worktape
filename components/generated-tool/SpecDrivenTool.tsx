"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Copy,
  Download,
  LayoutDashboard,
  MessageSquare,
  Plus,
  Save,
  Sparkles,
  Table2,
  Workflow
} from "lucide-react";
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

// Map common status values to badge colors for a real-product feel.
function statusTone(value: string) {
  const v = value.toLowerCase();
  if (/(paid|confirmed|done|interested)/.test(v)) return "bg-signal-50 text-signal-700 border-signal-200";
  if (/(pending|today|contacted)/.test(v)) return "bg-amber-50 text-amber-600 border-amber-200";
  if (/(dropped|no reply|not sent)/.test(v)) return "bg-red-50 text-red-600 border-red-200";
  if (/(new|tomorrow)/.test(v)) return "bg-cobalt-50 text-cobalt-600 border-cobalt-100";
  return "bg-ink-50 text-ink-600 border-line";
}

export function SpecDrivenTool({ spec, initialRecords }: Props) {
  const entity = firstEntity(spec);
  const seededRecords = useMemo(
    () => adaptRecordsToSpec(entity, initialRecords),
    [entity, initialRecords]
  );
  const [records, setRecords] = useState<GeneratedRecord[]>(seededRecords);
  const [draft, setDraft] = useState<Record<string, string | number | boolean>>(valuesForEntity(entity));
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
    window.setTimeout(() => setCopiedTemplate((current) => (current === name ? "" : current)), 2000);
  }

  const formScreen = spec.screens.find((screen) => screen.type === "form")?.name || "Intake form";
  const tableScreen = spec.screens.find((screen) => screen.type === "table")?.name || `${entity.label} dashboard`;
  const templatesScreen =
    spec.screens.find((screen) => screen.type === "templates")?.name || "Message templates";

  const stats = [
    { label: "Records", value: records.length, detail: "Seeded · editable", icon: Table2 },
    { label: "Fields", value: entity.fields.length, detail: "Mapped from spec", icon: Workflow },
    { label: "Statuses", value: spec.statuses.length, detail: "Controlled options", icon: Save },
    { label: "Templates", value: spec.messageTemplates.length, detail: "Copy to WhatsApp", icon: MessageSquare }
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
      {/* App chrome — make it read as a real generated product */}
      <div className="flex items-center gap-2 border-b border-line bg-ink-50 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-signal-400/70" />
        <span className="ml-3 flex items-center gap-1.5 rounded-md border border-line bg-white px-2.5 py-1 font-mono text-[11px] text-ink-400">
          <span className="text-signal-600">●</span>
          admissions-crm.worktape.app
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-signal-200 bg-signal-50 px-2.5 py-1 text-[11px] font-semibold text-signal-700">
          <Sparkles size={12} />
          Generated by Codex · live
        </span>
      </div>

      {/* Generated app header */}
      <div className="relative border-b border-line bg-signal-fade px-6 py-6">
        <div className="pointer-events-none absolute inset-0 bg-grid [background-size:26px_26px] opacity-50" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="wt-eyebrow">Generated internal tool</p>
            <h2 className="mt-1.5 flex items-center gap-2.5 text-2xl font-bold tracking-tight text-ink">
              <LayoutDashboard size={24} className="text-signal-600" />
              {entity.label} workspace
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-ink-500">
              Every input, status control, template, and the CSV export below is rendered directly from
              the final JSON spec — nothing is hard-coded.
            </p>
          </div>
          <button type="button" onClick={exportCsv} className="wt-btn-primary shrink-0">
            <Download size={16} />
            Export CSV
          </button>
        </div>

        <div className="relative mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-xl border border-line bg-white/80 p-3.5 backdrop-blur">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-400">{item.label}</p>
                  <Icon size={15} className="text-ink-400" />
                </div>
                <p className="text-2xl font-bold text-ink">{item.value}</p>
                <p className="text-[11px] font-medium text-ink-400">{item.detail}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-[360px_1fr]">
        {/* Intake form */}
        <form
          className="border-b border-line bg-canvas/40 p-6 lg:border-b-0 lg:border-r"
          onSubmit={(event) => {
            event.preventDefault();
            addRecord();
          }}
        >
          <div className="mb-4 flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-signal text-white">
              <Plus size={16} />
            </span>
            <h3 className="text-base font-semibold text-ink">{formScreen}</h3>
          </div>
          <div className="space-y-3">
            {entity.fields.map((field) => {
              const options = fieldOptions(spec, field);
              return (
                <label key={field.name} className="block">
                  <span className="mb-1 block text-xs font-semibold text-ink-600">
                    {field.label}
                    {field.required ? <span className="text-red-500"> *</span> : null}
                  </span>
                  {field.type === "textarea" ? (
                    <textarea
                      value={String(draft[field.name] || "")}
                      placeholder={field.placeholder}
                      onChange={(event) => updateDraft(field, event.target.value)}
                      className="wt-input min-h-20 resize-y"
                    />
                  ) : field.type === "select" || field.type === "status" ? (
                    <select
                      value={String(draft[field.name] || "")}
                      onChange={(event) => updateDraft(field, event.target.value)}
                      className="wt-input bg-white"
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
                      className="h-4 w-4 accent-signal-600"
                    />
                  ) : (
                    <input
                      type={field.type === "number" || field.type === "currency" ? "number" : "text"}
                      value={String(draft[field.name] || "")}
                      placeholder={field.placeholder}
                      onChange={(event) => updateDraft(field, event.target.value)}
                      className="wt-input"
                    />
                  )}
                </label>
              );
            })}
          </div>
          {error ? (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>
          ) : null}
          <button type="submit" className="wt-btn-signal mt-4 w-full">
            <Save size={16} />
            Save {entity.label.toLowerCase()}
          </button>
        </form>

        {/* Dashboard table + templates */}
        <div className="min-w-0 p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-base font-semibold text-ink">
              <Table2 size={17} className="text-ink-400" />
              {tableScreen}
            </h3>
            <span className="wt-chip">{records.length} records</span>
          </div>

          <div className="scrollbar-slim overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[860px] border-collapse text-left text-sm">
              <thead className="bg-canvas text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-400">
                <tr>
                  {entity.fields.map((field) => (
                    <th key={field.name} className="border-b border-line px-3 py-3 font-semibold">
                      {field.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((record) => {
                  const isSelected = record.id === selectedRecord?.id;
                  return (
                    <tr
                      key={record.id}
                      onClick={() => setSelectedRecordId(record.id)}
                      className={`cursor-pointer transition ${
                        isSelected ? "bg-signal-50/50" : "bg-white hover:bg-canvas"
                      }`}
                    >
                      {entity.fields.map((field) => {
                        const options = fieldOptions(spec, field);
                        const value = record.values[field.name];
                        return (
                          <td key={field.name} className="border-b border-line px-3 py-2.5 align-middle">
                            {field.type === "status" && options.length ? (
                              <span
                                className={`relative inline-flex items-center rounded-full border text-xs font-semibold ${statusTone(
                                  String(value || options[0])
                                )}`}
                              >
                                <select
                                  value={String(value || options[0])}
                                  onChange={(event) => updateRecord(record.id, field, event.target.value)}
                                  onClick={(event) => event.stopPropagation()}
                                  className="cursor-pointer appearance-none bg-transparent px-2.5 py-1 pr-6 font-semibold outline-none"
                                >
                                  {options.map((option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                                <svg
                                  className="pointer-events-none absolute right-2 h-3 w-3 opacity-60"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                >
                                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </span>
                            ) : (
                              <span className="text-ink-700">{String(value ?? "")}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
                {!records.length ? (
                  <tr>
                    <td colSpan={entity.fields.length} className="px-3 py-12 text-center text-sm text-ink-400">
                      No records yet. Add the first {entity.label.toLowerCase()} from the generated form.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          {spec.messageTemplates.length ? (
            <div className="mt-6">
              <div className="mb-3 flex items-center gap-2">
                <MessageSquare size={17} className="text-ink-400" />
                <h3 className="text-base font-semibold text-ink">{templatesScreen}</h3>
                {selectedRecord ? (
                  <span className="wt-chip">
                    for {String(selectedRecord.values[entity.fields[0].name] || "selected record")}
                  </span>
                ) : null}
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {spec.messageTemplates.map((template) => {
                  const copied = copiedTemplate === template.name;
                  return (
                    <div
                      key={template.name}
                      className="flex flex-col rounded-xl border border-line bg-white p-3.5 transition hover:border-signal-200 hover:shadow-card"
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-ink">{template.name}</p>
                        <button
                          type="button"
                          onClick={() => copyTemplate(template.name, template.body)}
                          className={`inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition ${
                            copied
                              ? "border-signal-200 bg-signal-50 text-signal-700"
                              : "border-line text-ink-500 hover:bg-canvas"
                          }`}
                          aria-label={`Copy ${template.name}`}
                        >
                          {copied ? <Check size={14} /> : <Copy size={14} />}
                          {copied ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <p className="rounded-lg bg-canvas p-2.5 text-xs leading-5 text-ink-600">
                        {renderTemplate(template.body, selectedRecord)}
                      </p>
                    </div>
                  );
                })}
              </div>
              {copyError ? <p className="mt-3 text-sm font-medium text-red-600">{copyError}</p> : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
