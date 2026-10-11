import { EntityType, ENTITY_FIELDS, autoDetectMapping } from "./schemas";

export type DetectionResult = {
  entityType: EntityType;
  confidence: number;
};

const DETECTION_ORDER: EntityType[] = ["companies", "contacts", "deals", "tasks"];

export function detectEntityType(headers: string[]): DetectionResult {
  const scores: Record<EntityType, number> = {
    companies: 0,
    contacts: 0,
    deals: 0,
    tasks: 0,
  };

  for (const entityType of DETECTION_ORDER) {
    const fields = ENTITY_FIELDS[entityType];
    const mapping = autoDetectMapping(headers, fields);

    for (const fieldKey of Object.values(mapping)) {
      const field = fields.find((f) => f.key === fieldKey);
      if (field) {
        scores[entityType] += field.required ? 20 : 10;
      }
    }
  }

  let best: EntityType = "contacts";
  let bestScore = 0;

  for (const type of DETECTION_ORDER) {
    if (scores[type] > bestScore) {
      bestScore = scores[type];
      best = type;
    }
  }

  const total = DETECTION_ORDER.reduce((sum, t) => sum + scores[t], 0);
  const confidence = total > 0 ? Math.round((bestScore / total) * 100) : 50;

  return { entityType: best, confidence };
}
