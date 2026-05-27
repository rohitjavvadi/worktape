import fallbackSpecJson from "@/data/specs/admissions-fallback-spec.json";
import seedRecordsJson from "@/data/seed/admissions-records.json";
import {
  type GeneratedRecord,
  type WorkflowSpec,
  workflowSpecSchema
} from "@/lib/workflow-spec";

export const fallbackSpec: WorkflowSpec = workflowSpecSchema.parse(fallbackSpecJson);
export const fallbackRecords = seedRecordsJson as GeneratedRecord[];
