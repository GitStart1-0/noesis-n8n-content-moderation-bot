// n8n Code node: Prepare Revised AI JSON
// Exported from workflows/noesis-telegram-content-moderation.workflow.json

const input = $input.first().json;

const aiText =
  input.output_text ||
  input.output?.[0]?.content?.[0]?.text ||
  input.output?.[0]?.content?.find?.(c => c.type === "output_text")?.text ||
  input.text ||
  "";

if (!aiText) {
  return [
    {
      json: {
        message: { text: "" },
        aiError: "OpenAI РЅРµ РїРѕРІРµСЂРЅСѓРІ С‚РµРєСЃС‚ Сѓ РІС–РґРѕРјРѕРјСѓ РїРѕР»С–.",
        raw: input
      }
    }
  ];
}

const cleaned = String(aiText)
  .trim()
  .replace(/^```json\s*/i, "")
  .replace(/^```\s*/i, "")
  .replace(/```$/i, "")
  .trim();

const revision = $("Prepare Revision Comment").item.json;

return [
  {
    json: {
      message: {
        text: cleaned,
        chat: {
          id: revision.telegramChatId
        },
        from: {
          id: revision.telegramFromId || 59229320
        },
        message_id: revision.revisionReplyMessageId || revision.originalTelegramMessageId
      },
      generationOptions: {
        saveToDb: true,
        sendDocument: false,
        format: "markdown",
        mode: "revision",
        topic: revision.generationOptions?.topic || "revision",
        revisedFrom: revision.questionId,
        revisionComment: revision.revisionComment
      }
    }
  }
];
