// n8n Code node: Prepare OpenAI Revision Request
// Exported from workflows/noesis-telegram-content-moderation.workflow.json

const pending = $input.item.json;

const documentData = pending.documentData;
const revisionComment = pending.revisionComment;

if (!documentData) {
  return [
    {
      json: {
        ok: false,
        error: "РќРµРјР°С” documentData РґР»СЏ РїРµСЂРµСЂРѕР±РєРё РїРёС‚Р°РЅРЅСЏ.",
        telegramChatId: pending.telegramChatId
      }
    }
  ];
}

if (!revisionComment) {
  return [
    {
      json: {
        ok: false,
        error: "РќРµРјР°С” revisionComment РґР»СЏ РїРµСЂРµСЂРѕР±РєРё РїРёС‚Р°РЅРЅСЏ.",
        telegramChatId: pending.telegramChatId
      }
    }
  ];
}

const prompt = [
  "РўРё СЂРµРґР°РєС‚РѕСЂ РїРёС‚Р°РЅСЊ РґР»СЏ РѕСЃРІС–С‚РЅСЊРѕРіРѕ Р·Р°СЃС‚РѕСЃСѓРЅРєСѓ NoesisQuiz.",
  "",
  "Р„ СЃС‚Р°СЂРµ РїРёС‚Р°РЅРЅСЏ Сѓ JSON С– РєРѕРјРµРЅС‚Р°СЂ Р»СЋРґРёРЅРё, С‰Рѕ СЃР°РјРµ РїРѕС‚СЂС–Р±РЅРѕ Р·РјС–РЅРёС‚Рё.",
  "",
  "Р—Р°РІРґР°РЅРЅСЏ: РїРµСЂРµРїРёС€Рё РїРёС‚Р°РЅРЅСЏ РІС–РґРїРѕРІС–РґРЅРѕ РґРѕ РєРѕРјРµРЅС‚Р°СЂСЏ, Р°Р»Рµ Р·Р±РµСЂРµР¶Рё С„РѕСЂРјР°С‚ NoesisQuiz.",
  "",
  "РџРѕРІРµСЂРЅРё С‚С–Р»СЊРєРё РІР°Р»С–РґРЅРёР№ JSON Р±РµР· Markdown С– Р±РµР· РїРѕСЏСЃРЅРµРЅСЊ РїРѕР·Р° JSON.",
  "",
  "РљРѕРјРµРЅС‚Р°СЂ Р»СЋРґРёРЅРё:",
  revisionComment,
  "",
  "РЎС‚Р°СЂРµ РїРёС‚Р°РЅРЅСЏ documentData:",
  JSON.stringify(documentData, null, 2),
  "",
  "РџРѕРІРµСЂРЅРё JSON РІРµСЂС…РЅСЊРѕРіРѕ СЂС–РІРЅСЏ С‚Р°РєРѕРіРѕ С„РѕСЂРјР°С‚Сѓ:",
  JSON.stringify(
    {
      categoryId: documentData.categoryId,
      levelId: String(documentData.levelId),
      num: documentData.num,
      block: documentData.block,
      slug: `${documentData.slug || "revised-question"}-revised`,
      data: {
        lang: "ua",
        type: documentData.type,
        question: "...",
        answers: ["...", "...", "...", "...", "...", "..."],
        correctAnswerIndices: [0],
        explanation: "...",
        topics: documentData.topics || [],
        scientificDisciplines: documentData.scientificDisciplines || [],
        recommendedLiterature: [],
        revisedFrom: pending.questionId
      }
    },
    null,
    2
  ),
  "",
  "РџСЂР°РІРёР»Р°:",
  "- Р’РёРєРѕРЅР°Р№ СЃР°РјРµ РєРѕРјРµРЅС‚Р°СЂ Р»СЋРґРёРЅРё.",
  "- РќРµ Р·РјС–РЅСЋР№ categoryId, levelId, block С– num Р±РµР· РїРѕС‚СЂРµР±Рё.",
  "- РЇРєС‰Рѕ type = SINGLE_CHOICE, РјР°С” Р±СѓС‚Рё СЂС–РІРЅРѕ 6 РІР°СЂС–Р°РЅС‚С–РІ answers.",
  "- РќРµРїСЂР°РІРёР»СЊРЅС– РІР°СЂС–Р°РЅС‚Рё РјР°СЋС‚СЊ Р±СѓС‚Рё РїСЂР°РІРґРѕРїРѕРґС–Р±РЅРёРјРё, Р°Р»Рµ РЅРµРїСЂР°РІРёР»СЊРЅРёРјРё.",
  "- РџРѕСЏСЃРЅРµРЅРЅСЏ РјР°С” РІС–РґРїРѕРІС–РґР°С‚Рё РЅРѕРІРѕРјСѓ С„РѕСЂРјСѓР»СЋРІР°РЅРЅСЋ.",
  "- РќРµ РІРёРіР°РґСѓР№ РґР¶РµСЂРµР»Р°. РЇРєС‰Рѕ РґР¶РµСЂРµР»Рѕ РЅРµ РІРїРµРІРЅРµРЅРµ, recommendedLiterature Р·Р°Р»РёС€ []."
].join("\n");

return [
  {
    json: {
      ...pending,
      openAiRevisionBody: {
        model: "gpt-4.1-mini",
        input: prompt
      }
    }
  }
];
