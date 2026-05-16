// n8n Code node: Prepare AI JSON
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

const parseOptions = $("Parse Generate Options").item.json;

let sourceContext = {};

try {
  if ($("Decide Source Sufficiency").isExecuted) {
    sourceContext = $("Decide Source Sufficiency").item.json;
  } else if ($("Build Source Brief").isExecuted) {
    sourceContext = $("Build Source Brief").item.json;
  }
} catch (error) {
  sourceContext = {};
}

return [
  {
    json: {
      message: {
        text: cleaned,
        chat: {
          id: parseOptions.telegramChatId
        },
        from: {
          id: parseOptions.telegramFromId
        },
        message_id: parseOptions.originalTelegramMessageId
      },
      generationOptions: {
        saveToDb: parseOptions.saveToDb,
        sendDocument: parseOptions.sendDocument,
        format: parseOptions.format,
        mode: parseOptions.mode,
        topic: parseOptions.topic,
        categoryId: parseOptions.categoryId,
        levelId: parseOptions.levelId,
        block: parseOptions.block,
        type: parseOptions.type,
        researchEnabled: parseOptions.researchEnabled,
        reviewEnabled: parseOptions.reviewEnabled,
        autoReview: parseOptions.autoReview,

        sourceBriefQuality: sourceContext.sourceBriefQuality || null,
        sourceBriefStatus: sourceContext.sourceBriefStatus || null,
        sourceConfidence: sourceContext.sourceConfidence ?? null,
        sourceAuthoritySummary: sourceContext.sourceAuthoritySummary || null,
        sourcePolicy: sourceContext.sourcePolicy || null,
        sourceSufficiency: sourceContext.sourceSufficiency || null,
        researchProvider: sourceContext.researchProvider || parseOptions.researchProvider || null,
        sourceCount: Array.isArray(sourceContext.retrievedSources)
          ? sourceContext.retrievedSources.length
          : 0
      }
    }
  }
];

