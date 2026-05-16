// n8n Code node: Build Source Cache Key
// Exported from workflows/noesis-telegram-content-moderation.workflow.json

const input = $input.item.json;

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const keyParts = {
  topic: normalize(input.topic),
  searchQuery: normalize(input.searchQuery),
  categoryId: input.categoryId || null,
  levelId: String(input.levelId || ""),
  researchProvider: input.researchProvider || "openalex",
  sourceLimit: Number(input.sourceLimit || 3),
  sourcePolicyDiscipline: input.sourcePolicy?.discipline || null,
  version: "sourcebrief-v1"
};

const rawKey = JSON.stringify(keyParts);

let hash = 0;
for (let i = 0; i < rawKey.length; i++) {
  hash = ((hash << 5) - hash) + rawKey.charCodeAt(i);
  hash |= 0;
}

const sourceBriefCacheKey = `sb_${Math.abs(hash).toString(36)}`;

return [
  {
    json: {
      ...input,
      sourceBriefCacheKey,
      sourceBriefCacheKeyParts: keyParts
    }
  }
];

