// n8n Code node: Prepare Revision Comment
// Exported from workflows/noesis-telegram-content-moderation.workflow.json

const pending = $input.item.json;

const revision = $("Parse Revision Reply").item.json;

const now = new Date().toISOString();

const revisionHistory = Array.isArray(pending.revisionHistory)
  ? pending.revisionHistory
  : [];

revisionHistory.push({
  comment: revision.revisionComment,
  receivedAt: revision.receivedAt,
  replyMessageId: revision.revisionReplyMessageId
});

return [
  {
    json: {
      ...pending,
      status: "revision_comment_received",
      revisionComment: revision.revisionComment,
      revisionHistory,
      updatedAt: now,
      telegramChatId: revision.telegramChatId
    }
  }
];
