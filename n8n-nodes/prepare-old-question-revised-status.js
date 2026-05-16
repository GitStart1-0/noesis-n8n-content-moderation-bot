// n8n Code node: Prepare Old Question Revised Status
// Exported from workflows/noesis-telegram-content-moderation.workflow.json

const newQuestion = $input.item.json;
const revisionSource = $("Prepare Revision Comment").item.json;
const now = new Date().toISOString();

return [
  {
    json: {
      questionId: revisionSource.questionId,
      status: "revised",
      revisedAt: now,
      revisedQuestionId: newQuestion.questionId,
      revisionComment: revisionSource.revisionComment,
      updatedAt: now,

      targetCollectionPath: revisionSource.targetCollectionPath,
      targetLevelDocumentPath: revisionSource.targetLevelDocumentPath,
      documentData: revisionSource.documentData,
      previewText: revisionSource.previewText,
      telegramChatId: revisionSource.telegramChatId,
      originalTelegramMessageId: revisionSource.originalTelegramMessageId,
      generationOptions: revisionSource.generationOptions || null,
      createdAt: revisionSource.createdAt,
      revisionRequestedAt: revisionSource.revisionRequestedAt,
      revisionHistory: revisionSource.revisionHistory || []
    }
  }
];
