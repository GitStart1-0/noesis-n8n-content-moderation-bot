// n8n Code node: Parse Question JSON
// Exported from workflows/noesis-telegram-content-moderation.workflow.json

function fail(message, errorType = "validation_error") {
  const input = $input.item?.json || {};

  return [
    {
      json: {
        valid: false,
        error: message,
        errorType,
        telegramChatId: input.message?.chat?.id || input.telegramChatId || null,
        telegramFromId: input.message?.from?.id || input.telegramFromId || null,
        originalTelegramMessageId: input.message?.message_id || input.originalTelegramMessageId || null,
        generationOptions: input.generationOptions || null
      },
    },
  ];
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/С—/g, "i")
    .replace(/С–/g, "i")
    .replace(/С”/g, "e")
    .replace(/Т‘/g, "g")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function randomId(length = 4) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
}

function formatAnswerPreview(data) {
  if (Array.isArray(data.answers)) {
    return data.answers
      .map((answer, index) => {
        const isCorrect = Array.isArray(data.correctAnswerIndices)
          && data.correctAnswerIndices.includes(index);

        return `${index + 1}. ${answer}${isCorrect ? " вњ…" : ""}`;
      })
      .join("\n");
  }

  if (data.type === "TRUE_FALSE") {
    return `РџСЂР°РІРёР»СЊРЅР° РІС–РґРїРѕРІС–РґСЊ: ${data.correctAnswer ? "РўР°Рє" : "РќС–"}`;
  }

  if (Array.isArray(data.correctAnswers)) {
    return `РџСЂР°РІРёР»СЊРЅС– РІС–РґРїРѕРІС–РґС–: ${data.correctAnswers.join(", ")}`;
  }

  if (data.type === "MATCHING") {
    return [
      "Р›С–РІР° СЃС‚РѕСЂРѕРЅР°:",
      ...(data.leftSide || []).map((x, i) => `${i + 1}. ${x}`),
      "",
      "РџСЂР°РІР° СЃС‚РѕСЂРѕРЅР°:",
      ...(data.rightSide || []).map((x, i) => `${i + 1}. ${x}`),
    ].join("\n");
  }

  if (data.type === "COMPARISON") {
    return [
      "РљР°С‚РµРіРѕСЂС–С—:",
      ...(data.categories || []).map((x, i) => `${i + 1}. ${x}`),
      "",
      "РўРІРµСЂРґР¶РµРЅРЅСЏ:",
      ...(data.statements || []).map((x, i) => `${i + 1}. ${x.text}`),
    ].join("\n");
  }

  return "Р”Р»СЏ С†СЊРѕРіРѕ С‚РёРїСѓ РїРёС‚Р°РЅРЅСЏ РєРѕСЂРѕС‚РєРёР№ preview С‰Рµ РЅРµ РЅР°Р»Р°С€С‚РѕРІР°РЅРёР№.";
}

const input = $input.item.json;
const messageText = input.message?.text;

if (!messageText) {
  return fail("РџРѕРІС–РґРѕРјР»РµРЅРЅСЏ Telegram РЅРµ РјС–СЃС‚РёС‚СЊ С‚РµРєСЃС‚Сѓ.");
}

if (messageText.startsWith("/")) {
  return fail("Р¦Рµ СЃР»СѓР¶Р±РѕРІР° РєРѕРјР°РЅРґР° Telegram, Р° РЅРµ JSON РїРёС‚Р°РЅРЅСЏ.");
}

let payload;

try {
  payload = JSON.parse(messageText);
} catch (error) {
  return fail("РџРѕРІС–РґРѕРјР»РµРЅРЅСЏ РЅРµ С” РІР°Р»С–РґРЅРёРј JSON. РџРµСЂРµРІС–СЂ Р»Р°РїРєРё, РєРѕРјРё С‚Р° РґСѓР¶РєРё.");
}

const allowedCategories = [
  "erudite",
  "science",
  "philosophy",
  "culture",
  "noesis",
  "agora",
];

const allowedTypes = [
  "SINGLE_CHOICE",
  "MULTIPLE_CHOICE",
  "TRUE_FALSE",
  "SEQUENCE",
  "MATCHING",
  "COMPARISON",
  "TEXT_INPUT",
  "FILL_IN_THE_BLANK",
  "IMAGE_CHOICE",
  "READING_COMPREHENSION",
  "SLIDER_SCALE",
  "TEN_FACTS",
];

const categoryId = payload.categoryId || input.generationOptions?.categoryId;
const levelId = String(payload.levelId || input.generationOptions?.levelId || "");
const rawNum = payload.num ?? input.generationOptions?.num ?? 1;
const num = Number(rawNum);
const block = String(payload.block || input.generationOptions?.block || "").toUpperCase();
const rawSlug = payload.slug;
const data = payload.data;


if (!allowedCategories.includes(categoryId)) {
  return fail("РќРµРІР°Р»С–РґРЅРёР№ categoryId. Р”РѕР·РІРѕР»РµРЅРѕ: erudite, science, philosophy, culture, noesis, agora.");
}

if (!levelId) {
  return fail("Р’С–РґСЃСѓС‚РЅС” РїРѕР»Рµ levelId.");
}

if (!Number.isInteger(num) || num < 1 || num > 999) {
  return fail("РџРѕР»Рµ num РјР°С” Р±СѓС‚Рё С†С–Р»РёРј С‡РёСЃР»РѕРј РІС–Рґ 1 РґРѕ 999.");
}

if (!/^[A-Z]$/.test(block)) {
  return fail("РџРѕР»Рµ block РјР°С” Р±СѓС‚Рё РѕРґРЅС–С”СЋ РІРµР»РёРєРѕСЋ Р»С–С‚РµСЂРѕСЋ: A, B, C С‚РѕС‰Рѕ.");
}

if (!data || typeof data !== "object") {
  return fail("Р’С–РґСЃСѓС‚РЅС–Р№ РѕР±'С”РєС‚ data.");
}

if (data.lang !== "ua") {
  return fail("РџРѕР»Рµ data.lang РјР°С” Р±СѓС‚Рё ua.");
}

if (!allowedTypes.includes(data.type)) {
  return fail("РќРµРІР°Р»С–РґРЅРёР№ type. РўРёРї РїРёС‚Р°РЅРЅСЏ РјР°С” Р±СѓС‚Рё РЅР°РїРёСЃР°РЅРёР№ Р’Р•Р РҐРќР†Рњ Р Р•Р“Р†РЎРўР РћРњ.");
}

if (!Array.isArray(data.topics) || data.topics.length === 0) {
  return fail("РџРѕР»Рµ data.topics С” РѕР±РѕРІ'СЏР·РєРѕРІРёРј С– РјР°С” Р±СѓС‚Рё РЅРµРїРѕСЂРѕР¶РЅС–Рј РјР°СЃРёРІРѕРј.");
}

if (!data.question && !["READING_COMPREHENSION", "SLIDER_SCALE"].includes(data.type)) {
  return fail("РџРѕР»Рµ data.question С” РѕР±РѕРІ'СЏР·РєРѕРІРёРј РґР»СЏ С†СЊРѕРіРѕ С‚РёРїСѓ РїРёС‚Р°РЅРЅСЏ.");
}

if (data.provenance && typeof data.provenance !== "object") {
  return fail("РџРѕР»Рµ data.provenance РјР°С” Р±СѓС‚Рё РѕР±'С”РєС‚РѕРј.");
}

if (data.provenance?.sourceIds && !Array.isArray(data.provenance.sourceIds)) {
  return fail("РџРѕР»Рµ data.provenance.sourceIds РјР°С” Р±СѓС‚Рё РјР°СЃРёРІРѕРј.");
}

if (Array.isArray(data.correctAnswerIndices)) {
  data.correctAnswerIndices = data.correctAnswerIndices.map(Number);
}

switch (data.type) {
  case "SINGLE_CHOICE":
    if (!Array.isArray(data.answers) || data.answers.length !== 6) {
      return fail("SINGLE_CHOICE РїРѕРІРёРЅРµРЅ РјР°С‚Рё СЂС–РІРЅРѕ 6 РІР°СЂС–Р°РЅС‚С–РІ answers.");
    }

    if (!Array.isArray(data.correctAnswerIndices) || data.correctAnswerIndices.length !== 1) {
      return fail("SINGLE_CHOICE РїРѕРІРёРЅРµРЅ РјР°С‚Рё РѕРґРёРЅ РїСЂР°РІРёР»СЊРЅРёР№ С–РЅРґРµРєСЃ Сѓ correctAnswerIndices.");
    }
    break;

  case "MULTIPLE_CHOICE":
    if (!Array.isArray(data.answers) || data.answers.length !== 6) {
      return fail("MULTIPLE_CHOICE РїРѕРІРёРЅРµРЅ РјР°С‚Рё СЂС–РІРЅРѕ 6 РІР°СЂС–Р°РЅС‚С–РІ answers.");
    }

    if (!Array.isArray(data.correctAnswerIndices) || data.correctAnswerIndices.length < 2) {
      return fail("MULTIPLE_CHOICE РїРѕРІРёРЅРµРЅ РјР°С‚Рё С‰РѕРЅР°Р№РјРµРЅС€Рµ РґРІР° РїСЂР°РІРёР»СЊРЅС– С–РЅРґРµРєСЃРё.");
    }
    break;

  case "TRUE_FALSE":
    if (typeof data.correctAnswer !== "boolean") {
      return fail("TRUE_FALSE РїРѕРІРёРЅРµРЅ РјР°С‚Рё correctAnswer С‚РёРїСѓ boolean: true Р°Р±Рѕ false.");
    }
    break;

  case "SEQUENCE":
    if (!Array.isArray(data.answers) || data.answers.length < 4 || data.answers.length > 6) {
      return fail("SEQUENCE РїРѕРІРёРЅРµРЅ РјР°С‚Рё РІС–Рґ 4 РґРѕ 6 РµР»РµРјРµРЅС‚С–РІ answers.");
    }

    if (!Array.isArray(data.correctAnswerIndices) || data.correctAnswerIndices.length !== data.answers.length) {
      return fail("SEQUENCE РїРѕРІРёРЅРµРЅ РјР°С‚Рё correctAnswerIndices С‚С–С”С— СЃР°РјРѕС— РґРѕРІР¶РёРЅРё, С‰Рѕ Р№ answers.");
    }
    break;

  case "MATCHING":
    if (!Array.isArray(data.leftSide) || !Array.isArray(data.rightSide) || !Array.isArray(data.correctMatches)) {
      return fail("MATCHING РїРѕРІРёРЅРµРЅ РјР°С‚Рё leftSide, rightSide С– correctMatches.");
    }
    break;

  case "COMPARISON":
    if (!Array.isArray(data.categories) || !Array.isArray(data.statements)) {
      return fail("COMPARISON РїРѕРІРёРЅРµРЅ РјР°С‚Рё categories С– statements.");
    }
    break;

  case "TEXT_INPUT":
  case "FILL_IN_THE_BLANK":
    if (!Array.isArray(data.correctAnswers) || data.correctAnswers.length === 0) {
      return fail(`${data.type} РїРѕРІРёРЅРµРЅ РјР°С‚Рё correctAnswers.`);
    }
    break;

  case "IMAGE_CHOICE":
    if (!Array.isArray(data.answers) || !Array.isArray(data.correctAnswerIndices)) {
      return fail("IMAGE_CHOICE РїРѕРІРёРЅРµРЅ РјР°С‚Рё answers С– correctAnswerIndices.");
    }
    break;

  case "READING_COMPREHENSION":
    if (!data.text1 || !data.text2 || !Array.isArray(data.questions)) {
      return fail("READING_COMPREHENSION РїРѕРІРёРЅРµРЅ РјР°С‚Рё text1, text2 С– questions.");
    }
    break;

  case "SLIDER_SCALE":
    if (!data.text || !Array.isArray(data.sliders)) {
      return fail("SLIDER_SCALE РїРѕРІРёРЅРµРЅ РјР°С‚Рё text С– sliders.");
    }
    break;

  case "TEN_FACTS":
    if (!Array.isArray(data.answers) || data.answers.length !== 6) {
      return fail("TEN_FACTS РїРѕРІРёРЅРµРЅ РјР°С‚Рё СЂС–РІРЅРѕ 6 РІР°СЂС–Р°РЅС‚С–РІ answers.");
    }

    if (!Array.isArray(data.correctAnswerIndices) || data.correctAnswerIndices.length !== 1) {
      return fail("TEN_FACTS РїРѕРІРёРЅРµРЅ РјР°С‚Рё РѕРґРёРЅ РїСЂР°РІРёР»СЊРЅРёР№ С–РЅРґРµРєСЃ.");
    }

    if (!Array.isArray(data.facts) || data.facts.length === 0) {
      return fail("TEN_FACTS РїРѕРІРёРЅРµРЅ РјР°С‚Рё facts.");
    }
    break;
}

const numPart = String(num).padStart(2, "0");
const slug = slugify(rawSlug || data.question || data.type);
const questionId = `${data.lang}--${numPart}--${block}--${slug}--${randomId()}`;
const now = new Date().toISOString();

const documentData = {
  ...data,
  categoryId,
  levelId,
  questionId,
  num,
  block,
  slug,
  status: "pending_review",
  source: "telegram-n8n",
  createdAt: now,
  updatedAt: now,
};

const generationOptions = input.generationOptions || {};
const sourceQualityText = generationOptions.researchEnabled
  ? [
      `РЇРєС–СЃС‚СЊ РґР¶РµСЂРµР»: ${generationOptions.sourceBriefQuality || "unknown"}`,
      `Source confidence: ${generationOptions.sourceConfidence ?? "unknown"}`,
      generationOptions.sourceSufficiency?.reason
        ? `Source sufficiency: ${generationOptions.sourceSufficiency.reason}`
        : null
    ].filter(Boolean).join("\n")
  : null;

const previewText = [
  "рџ§  РќРѕРІРµ РїРёС‚Р°РЅРЅСЏ РЅР° РјРѕРґРµСЂР°С†С–СЋ",
  "",
  `РљР°С‚РµРіРѕСЂС–СЏ: ${categoryId}`,
  `Р С–РІРµРЅСЊ: ${levelId}`,
  `Р‘Р»РѕРє: ${block}`,
  `РўРёРї: ${data.type}`,
  `ID: ${questionId}`,
  `РўРµРјРё: ${data.topics.join(", ")}`,
  sourceQualityText,
  "",
  "РџРёС‚Р°РЅРЅСЏ:",
  data.question || data.text || "Р‘РµР· РєРѕСЂРѕС‚РєРѕРіРѕ С‚РµРєСЃС‚Сѓ РїРёС‚Р°РЅРЅСЏ",
  "",
  "Р’Р°СЂС–Р°РЅС‚Рё / РІС–РґРїРѕРІС–РґСЊ:",
  formatAnswerPreview(data),
  "",
  data.explanation ? `РџРѕСЏСЃРЅРµРЅРЅСЏ:\n${data.explanation}` : "РџРѕСЏСЃРЅРµРЅРЅСЏ: РЅРµ РґРѕРґР°РЅРѕ",
  "",
  data.provenance?.sourceIds?.length
    ? `Р”Р¶РµСЂРµР»Р°:\n${data.provenance.sourceIds.join("\n")}`
    : null,
  "",
  "Р”С–СЏ:",
  "вњ… Р·Р°РїРёСЃР°С‚Рё РІ Р‘Р”",
  "вќЊ РІС–РґС…РёР»РёС‚Рё",
  "вњЏпёЏ РїРµСЂРµСЂРѕР±РёС‚Рё",
].filter(Boolean).join("\n");

return [
  {
    json: {
      valid: true,
      categoryId,
      levelId,
      questionId,
      collectionPath: `${categoryId}/${levelId}/questions`,
      levelDocumentPath: `${categoryId}/${levelId}`,
      pendingCollectionPath: "pendingQuestions",
      documentData,
      previewText,
      telegramChatId: input.message.chat.id,
      telegramFromId: input.message.from.id,
      originalTelegramMessageId: input.message.message_id,

      generationOptions: input.generationOptions || null
    },
  },
];
