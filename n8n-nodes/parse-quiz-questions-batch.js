// n8n Code node: Parse Quiz Questions Batch
// Exported from workflows/noesis-telegram-content-moderation.workflow.json

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
        const isCorrect =
          Array.isArray(data.correctAnswerIndices) &&
          data.correctAnswerIndices.includes(index);

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

  return "Р”Р»СЏ С†СЊРѕРіРѕ С‚РёРїСѓ РїРёС‚Р°РЅРЅСЏ РєРѕСЂРѕС‚РєРёР№ preview С‰Рµ РЅРµ РЅР°Р»Р°С€С‚РѕРІР°РЅРёР№.";
}

function fail(input, message) {
  return {
    json: {
      valid: false,
      error: message,
      generationOptions: input.generationOptions || null,
      telegramChatId: input.message?.chat?.id,
      originalInput: input
    }
  };
}

function parseOne(input) {
  const messageText = input.message?.text;

  if (!messageText) {
    return fail(input, "РќРµРјР°С” message.text Р· JSON РїРёС‚Р°РЅРЅСЏ.");
  }

  let payload;

  try {
    payload = JSON.parse(messageText);
  } catch (error) {
    return fail(input, "message.text РЅРµ С” РІР°Р»С–РґРЅРёРј JSON.");
  }

  const allowedCategories = [
    "erudite",
    "science",
    "philosophy",
    "culture",
    "noesis",
    "agora"
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
    "TEN_FACTS"
  ];

  const categoryId = payload.categoryId;
  const levelId = String(payload.levelId || "");
  const num = Number(payload.num);
  const block = String(payload.block || "").toUpperCase();
  const rawSlug = payload.slug;
  const data = payload.data;

  if (!allowedCategories.includes(categoryId)) {
    return fail(input, "РќРµРІР°Р»С–РґРЅРёР№ categoryId.");
  }

  if (!levelId) {
    return fail(input, "Р’С–РґСЃСѓС‚РЅС” РїРѕР»Рµ levelId.");
  }

  if (!Number.isInteger(num) || num < 1 || num > 999) {
    return fail(input, "РџРѕР»Рµ num РјР°С” Р±СѓС‚Рё С†С–Р»РёРј С‡РёСЃР»РѕРј РІС–Рґ 1 РґРѕ 999.");
  }

  if (!/^[A-Z]$/.test(block)) {
    return fail(input, "РџРѕР»Рµ block РјР°С” Р±СѓС‚Рё РѕРґРЅС–С”СЋ РІРµР»РёРєРѕСЋ Р»С–С‚РµСЂРѕСЋ.");
  }

  if (!data || typeof data !== "object") {
    return fail(input, "Р’С–РґСЃСѓС‚РЅС–Р№ РѕР±'С”РєС‚ data.");
  }

  if (data.lang !== "ua") {
    return fail(input, "РџРѕР»Рµ data.lang РјР°С” Р±СѓС‚Рё ua.");
  }

  if (!allowedTypes.includes(data.type)) {
    return fail(input, "РќРµРІР°Р»С–РґРЅРёР№ type.");
  }

  if (!Array.isArray(data.topics) || data.topics.length === 0) {
    return fail(input, "РџРѕР»Рµ data.topics С” РѕР±РѕРІ'СЏР·РєРѕРІРёРј.");
  }

  if (!data.question && !["READING_COMPREHENSION", "SLIDER_SCALE"].includes(data.type)) {
    return fail(input, "РџРѕР»Рµ data.question С” РѕР±РѕРІ'СЏР·РєРѕРІРёРј РґР»СЏ С†СЊРѕРіРѕ С‚РёРїСѓ РїРёС‚Р°РЅРЅСЏ.");
  }

  if (data.type === "SINGLE_CHOICE") {
    if (!Array.isArray(data.answers) || data.answers.length !== 6) {
      return fail(input, "SINGLE_CHOICE РїРѕРІРёРЅРµРЅ РјР°С‚Рё СЂС–РІРЅРѕ 6 РІР°СЂС–Р°РЅС‚С–РІ answers.");
    }

    if (!Array.isArray(data.correctAnswerIndices) || data.correctAnswerIndices.length !== 1) {
      return fail(input, "SINGLE_CHOICE РїРѕРІРёРЅРµРЅ РјР°С‚Рё РѕРґРёРЅ correctAnswerIndices.");
    }
  }

  if (data.type === "MULTIPLE_CHOICE") {
    if (!Array.isArray(data.answers) || data.answers.length !== 6) {
      return fail(input, "MULTIPLE_CHOICE РїРѕРІРёРЅРµРЅ РјР°С‚Рё СЂС–РІРЅРѕ 6 РІР°СЂС–Р°РЅС‚С–РІ answers.");
    }

    if (!Array.isArray(data.correctAnswerIndices) || data.correctAnswerIndices.length < 2) {
      return fail(input, "MULTIPLE_CHOICE РїРѕРІРёРЅРµРЅ РјР°С‚Рё С‰РѕРЅР°Р№РјРµРЅС€Рµ РґРІР° РїСЂР°РІРёР»СЊРЅС– С–РЅРґРµРєСЃРё.");
    }
  }

  if (data.type === "TRUE_FALSE" && typeof data.correctAnswer !== "boolean") {
    return fail(input, "TRUE_FALSE РїРѕРІРёРЅРµРЅ РјР°С‚Рё correctAnswer С‚РёРїСѓ boolean.");
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
    source: "telegram-n8n-ai-quiz",
    createdAt: now,
    updatedAt: now
  };

  const previewText = [
    "рџ§  РќРѕРІРµ РїРёС‚Р°РЅРЅСЏ РЅР° РјРѕРґРµСЂР°С†С–СЋ",
    "",
    `РљР°С‚РµРіРѕСЂС–СЏ: ${categoryId}`,
    `Р С–РІРµРЅСЊ: ${levelId}`,
    `Р‘Р»РѕРє: ${block}`,
    `РўРёРї: ${data.type}`,
    `ID: ${questionId}`,
    `РўРµРјРё: ${data.topics.join(", ")}`,
    "",
    "РџРёС‚Р°РЅРЅСЏ:",
    data.question || data.text || "Р‘РµР· РєРѕСЂРѕС‚РєРѕРіРѕ С‚РµРєСЃС‚Сѓ РїРёС‚Р°РЅРЅСЏ",
    "",
    "Р’Р°СЂС–Р°РЅС‚Рё / РІС–РґРїРѕРІС–РґСЊ:",
    formatAnswerPreview(data),
    "",
    data.explanation ? `РџРѕСЏСЃРЅРµРЅРЅСЏ:\n${data.explanation}` : "РџРѕСЏСЃРЅРµРЅРЅСЏ: РЅРµ РґРѕРґР°РЅРѕ",
    "",
    "Р”С–СЏ:",
    "вњ… Р·Р°РїРёСЃР°С‚Рё РІ Р‘Р”",
    "вќЊ РІС–РґС…РёР»РёС‚Рё",
    "вњЏпёЏ РїРµСЂРµСЂРѕР±РёС‚Рё"
  ].join("\n");

  return {
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
    }
  };
}

return $input.all().map(item => parseOne(item.json));
