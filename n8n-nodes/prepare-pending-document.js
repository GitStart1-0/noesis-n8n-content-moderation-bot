// n8n Code node: Prepare Pending Document
// Exported from workflows/noesis-telegram-content-moderation.workflow.json

return $input.all().map((item) => {
  const source = item.json;

  return {
    json: {
      questionId: source.questionId,
      status: "pending_review",

      targetCollectionPath: source.collectionPath,
      targetLevelDocumentPath: source.levelDocumentPath,

      documentData: source.documentData,
      previewText: source.previewText,

      telegramChatId: source.telegramChatId,
      originalTelegramMessageId: source.originalTelegramMessageId,
      
      provenance: source.documentData?.provenance || null,
      generationOptions: source.generationOptions || null,

      createdAt: source.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  };
});
