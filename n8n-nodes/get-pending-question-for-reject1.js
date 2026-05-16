// n8n Code node: Get Pending Question for Reject1
// Exported from workflows/noesis-telegram-content-moderation.workflow.json

const pending = $input.item.json;

const now = new Date().toISOString();

return [
  {
    json: {
      ...pending,
      status: "rejected",
      rejectedAt: now,
      updatedAt: now
    }
  }
];
