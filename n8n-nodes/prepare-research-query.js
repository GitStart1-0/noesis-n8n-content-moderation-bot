// n8n Code node: Prepare Research Query
// Exported from workflows/noesis-telegram-content-moderation.workflow.json

const input = $input.item.json;

const topic = String(input.topic || "").trim();

const sourceLimit = Math.min(
  Math.max(Number(input.sourceLimit || 3), 1),
  5
);

const normalizedTopic = topic
  .replace(/\s+/g, " ")
  .trim();

const searchQuery = normalizedTopic;

return [
  {
    json: {
      ...input,
      searchQuery,
      sourceLimit
    }
  }
];
