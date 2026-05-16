// n8n Code node: Parse Generate Options
// Exported from workflows/noesis-telegram-content-moderation.workflow.json

const text = String($json.message?.text || "").trim();

function getParam(name, defaultValue = "") {
  const quoted = text.match(new RegExp(`${name}="([^"]+)"`, "i"));
  if (quoted) return quoted[1].trim();

  const simple = text.match(new RegExp(`${name}=([^\\s]+)`, "i"));
  if (simple) return simple[1].trim();

  return defaultValue;
}

const mode = text.startsWith("/generate_quiz")
  ? "quiz"
  : text.startsWith("/generate_question")
    ? "question"
    : "unknown";

if (mode === "unknown") {
  return [
    {
      json: {
        ok: false,
        error: "РќРµРІС–РґРѕРјР° РєРѕРјР°РЅРґР°. Р’РёРєРѕСЂРёСЃС‚Р°Р№ /generate_question Р°Р±Рѕ /generate_quiz.",
        telegramChatId: $json.message.chat.id
      }
    }
  ];
}

const topic = getParam("topic", "");
const categoryId = getParam("categoryId", "erudite");
const levelId = getParam("levelId", "1");
const block = getParam("block", "A").toUpperCase();
const type = getParam("type", "SINGLE_CHOICE").toUpperCase();

let requestedCount = Number(getParam("count", mode === "quiz" ? "5" : "1"));

if (!Number.isFinite(requestedCount) || requestedCount < 1) {
  requestedCount = mode === "quiz" ? 5 : 1;
}

const maxQuizCount = 10;

let count = requestedCount;

if (mode === "question") {
  count = 1;
}

if (mode === "quiz" && count > maxQuizCount) {
  count = maxQuizCount;
}

const saveToDb = /(?:^|\s)db=on(?:\s|$)/i.test(text);
const sendDocument = !/(?:^|\s)doc=off(?:\s|$)/i.test(text);

const format = getParam("format", "markdown").toLowerCase();

const reviewEnabled = ["on", "true", "1", "yes"].includes(
  String(getParam("review", "off")).toLowerCase()
);

const autoReview = !["off", "false", "0", "no"].includes(
  String(getParam("autoReview", "on")).toLowerCase()
);

const reviewReason = null;

const researchEnabled = ["on", "true", "1", "yes"].includes(
  String(getParam("research", "off")).toLowerCase()
);

const deepResearch = ["on", "true", "1", "yes"].includes(
  String(getParam("deep", "off")).toLowerCase()
);

let sourceLimit = Number(getParam("sources", "3"));

if (!Number.isFinite(sourceLimit) || sourceLimit < 1) {
  sourceLimit = 3;
}

sourceLimit = Math.min(sourceLimit, 5);

const researchProvider = getParam("provider", "openalex").toLowerCase();

if (!topic) {
  return [
    {
      json: {
        ok: false,
        error: "РќРµ РІРєР°Р·Р°РЅРѕ topic. РџСЂРёРєР»Р°Рґ: /generate_question topic=\"Р†РІР°РЅ РљРѕС‚Р»СЏСЂРµРІСЃСЊРєРёР№\" db=off doc=on",
        telegramChatId: $json.message.chat.id
      }
    }
  ];
}

return [
  {
    json: {
      ok: true,
      mode,
      topic,
      categoryId,
      levelId,
      block,
      type,
      count,
      requestedCount,
      maxQuizCount,
      countWasLimited: mode === "quiz" && requestedCount > maxQuizCount,
      saveToDb,
      sendDocument,
      format,
      researchEnabled,
      reviewEnabled,
      autoReview,
      reviewReason,
      deepResearch,
      sourceLimit,
      researchProvider,
      originalCommand: text,
      telegramChatId: $json.message.chat.id,
      telegramFromId: $json.message.from.id,
      originalTelegramMessageId: $json.message.message_id
    }
  }
];
