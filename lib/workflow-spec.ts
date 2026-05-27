import { z } from "zod";

export const fieldTypeSchema = z.enum([
  "text",
  "textarea",
  "number",
  "phone",
  "email",
  "date",
  "select",
  "status",
  "currency",
  "boolean"
]);

export const workflowFieldSchema = z.object({
  name: z.string().min(1),
  label: z.string().min(1),
  type: fieldTypeSchema,
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(),
  placeholder: z.string().optional()
});

export const workflowEntitySchema = z.object({
  name: z.string().min(1),
  label: z.string().min(1),
  description: z.string().min(1),
  fields: z.array(workflowFieldSchema).min(1)
});

export const workflowStepSchema = z.object({
  order: z.number(),
  title: z.string().min(1),
  tools: z.array(z.string()).default([]),
  input: z.string().min(1),
  output: z.string().min(1)
});

export const sourceEvidenceSchema = z.object({
  frameIndex: z.number(),
  timestamp: z.string().min(1),
  observation: z.string().min(1)
});

export const statusGroupSchema = z.object({
  name: z.string().min(1),
  label: z.string().min(1),
  values: z.array(z.string()).min(1)
});

export const messageTemplateSchema = z.object({
  name: z.string().min(1),
  body: z.string().min(1)
});

export const appScreenSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["form", "table", "detail", "templates", "summary"]),
  entity: z.string().optional(),
  description: z.string().optional()
});

export const validationRuleSchema = z.object({
  field: z.string().min(1),
  rule: z.enum(["required", "phone", "email", "number"]),
  message: z.string().optional()
});

export const exportRequirementsSchema = z.object({
  format: z.literal("csv"),
  entities: z.array(z.string()).min(1)
});

export const clarifyingQuestionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  defaultAnswer: z.string().min(1),
  answer: z.string().optional()
});

export const workflowSpecSchema = z.object({
  workflowSummary: z.string().min(1),
  confidence: z.number().min(0).max(1),
  sourceEvidence: z.array(sourceEvidenceSchema).default([]),
  steps: z.array(workflowStepSchema).min(1),
  entities: z.array(workflowEntitySchema).min(1),
  statuses: z.array(statusGroupSchema).default([]),
  actions: z.array(z.string()).default([]),
  painPoints: z.array(z.string()).default([]),
  messageTemplates: z.array(messageTemplateSchema).default([]),
  screens: z.array(appScreenSchema).min(1),
  validationRules: z.array(validationRuleSchema).default([]),
  exportRequirements: exportRequirementsSchema,
  clarifyingQuestions: z.array(clarifyingQuestionSchema).min(3).max(5)
});

export type WorkflowSpec = z.infer<typeof workflowSpecSchema>;
export type WorkflowField = z.infer<typeof workflowFieldSchema>;
export type WorkflowEntity = z.infer<typeof workflowEntitySchema>;

export type GeneratedRecord = {
  id: string;
  entity: string;
  values: Record<string, string | number | boolean>;
  createdAt: string;
};

export const workflowSpecJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "workflowSummary",
    "confidence",
    "sourceEvidence",
    "steps",
    "entities",
    "statuses",
    "actions",
    "painPoints",
    "messageTemplates",
    "screens",
    "validationRules",
    "exportRequirements",
    "clarifyingQuestions"
  ],
  properties: {
    workflowSummary: { type: "string" },
    confidence: { type: "number", minimum: 0, maximum: 1 },
    sourceEvidence: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["frameIndex", "timestamp", "observation"],
        properties: {
          frameIndex: { type: "number" },
          timestamp: { type: "string" },
          observation: { type: "string" }
        }
      }
    },
    steps: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["order", "title", "tools", "input", "output"],
        properties: {
          order: { type: "number" },
          title: { type: "string" },
          tools: { type: "array", items: { type: "string" } },
          input: { type: "string" },
          output: { type: "string" }
        }
      }
    },
    entities: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "label", "description", "fields"],
        properties: {
          name: { type: "string" },
          label: { type: "string" },
          description: { type: "string" },
          fields: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["name", "label", "type", "required", "options", "placeholder"],
              properties: {
                name: { type: "string" },
                label: { type: "string" },
                type: {
                  type: "string",
                  enum: [
                    "text",
                    "textarea",
                    "number",
                    "phone",
                    "email",
                    "date",
                    "select",
                    "status",
                    "currency",
                    "boolean"
                  ]
                },
                required: { type: "boolean" },
                options: {
                  anyOf: [
                    { type: "array", items: { type: "string" } },
                    { type: "null" }
                  ]
                },
                placeholder: { anyOf: [{ type: "string" }, { type: "null" }] }
              }
            }
          }
        }
      }
    },
    statuses: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "label", "values"],
        properties: {
          name: { type: "string" },
          label: { type: "string" },
          values: { type: "array", items: { type: "string" } }
        }
      }
    },
    actions: { type: "array", items: { type: "string" } },
    painPoints: { type: "array", items: { type: "string" } },
    messageTemplates: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "body"],
        properties: {
          name: { type: "string" },
          body: { type: "string" }
        }
      }
    },
    screens: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "type", "entity", "description"],
        properties: {
          name: { type: "string" },
          type: {
            type: "string",
            enum: ["form", "table", "detail", "templates", "summary"]
          },
          entity: { anyOf: [{ type: "string" }, { type: "null" }] },
          description: { anyOf: [{ type: "string" }, { type: "null" }] }
        }
      }
    },
    validationRules: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["field", "rule", "message"],
        properties: {
          field: { type: "string" },
          rule: { type: "string", enum: ["required", "phone", "email", "number"] },
          message: { anyOf: [{ type: "string" }, { type: "null" }] }
        }
      }
    },
    exportRequirements: {
      type: "object",
      additionalProperties: false,
      required: ["format", "entities"],
      properties: {
        format: { type: "string", enum: ["csv"] },
        entities: { type: "array", items: { type: "string" } }
      }
    },
    clarifyingQuestions: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "question", "defaultAnswer", "answer"],
        properties: {
          id: { type: "string" },
          question: { type: "string" },
          defaultAnswer: { type: "string" },
          answer: { anyOf: [{ type: "string" }, { type: "null" }] }
        }
      }
    }
  }
} as const;

export function applyClarifyingAnswers(
  spec: WorkflowSpec,
  answers: Record<string, string>
): WorkflowSpec {
  return {
    ...spec,
    clarifyingQuestions: spec.clarifyingQuestions.map((question) => ({
      ...question,
      answer: answers[question.id] || question.answer || question.defaultAnswer
    }))
  };
}

export function firstEntity(spec: WorkflowSpec): WorkflowEntity {
  return spec.entities[0];
}
