// n8n Code node: Prepare OpenAI Generate Request
// Exported from workflows/noesis-telegram-content-moderation.workflow.json

const input = $input.item.json;

const retrievedSources = Array.isArray(input.retrievedSources)
  ? input.retrievedSources
  : [];

const sourceIds = retrievedSources
  .map((s) => s.openAlexId)
  .filter(Boolean);

const sourceBrief = input.sourceBrief || "";

const provenanceTemplate = {
  sourceBriefUsed: Boolean(sourceBrief),
  sourceCount: retrievedSources.length,
  sourceIds,
};

const prompt = [
  "РўРё РіРµРЅРµСЂР°С‚РѕСЂ РѕСЃРІС–С‚РЅСЊРѕРіРѕ РєРѕРЅС‚РµРЅС‚Сѓ РґР»СЏ NoesisQuiz.",
  "",
  "РџР°СЂР°РјРµС‚СЂРё:",
  `mode: ${input.mode}`,
  `topic: ${input.topic}`,
  `categoryId: ${input.categoryId}`,
  `levelId: ${input.levelId}`,
  `block: ${input.block}`,
  `type: ${input.type}`,
  `count: ${input.count}`,
  `researchEnabled: ${input.researchEnabled}`,
  `sourceBriefStatus: ${input.sourceBriefStatus || "none"}`,
  `sourceCount: ${retrievedSources.length}`,
  "",
  
  `sourceBriefQuality: ${input.sourceBriefQuality || "none"}`,
  `sourceConfidence: ${input.sourceConfidence ?? "none"}`,

  "",
"SOURCE SUFFICIENCY:",
JSON.stringify(input.sourceSufficiency || null, null, 2),
"",
"РџСЂР°РІРёР»Р° source sufficiency:",
"- РЇРєС‰Рѕ sourceSufficiency.sufficientForDraft = false, РїРѕРІРµСЂРЅРё JSON Р·С– status=\"insufficient_sources\" С– РЅРµ РІРёРіР°РґСѓР№ РїРёС‚Р°РЅРЅСЏ.",
"- РЇРєС‰Рѕ sourceSufficiency.sufficientForDb = false, РїРёС‚Р°РЅРЅСЏ РјРѕР¶Рµ Р±СѓС‚Рё С‚С–Р»СЊРєРё draft РґР»СЏ review, Р±РµР· РїСЂРµС‚РµРЅР·С–С— РЅР° РіРѕС‚РѕРІРЅС–СЃС‚СЊ РґРѕ Р‘Р”.",
"- РЇРєС‰Рѕ sourceSufficiency.reason = insufficient_sources_for_db Р°Р±Рѕ weak_sources_for_db, Р±СѓРґСЊ РѕСЃРѕР±Р»РёРІРѕ РєРѕРЅСЃРµСЂРІР°С‚РёРІРЅРёРј: РЅРµ РґРѕРґР°РІР°Р№ С‚РѕС‡РЅС– С„Р°РєС‚Рё, СЏРєРёС… РїСЂСЏРјРѕ РЅРµРјР°С” Сѓ sourceBrief.",

  
  sourceBrief ? `SOURCE BRIEF:\n${sourceBrief}` : "SOURCE BRIEF: none",
  "",
  "РџСЂР°РІРёР»Рѕ source-backed generation:",
  "- РЇРєС‰Рѕ SOURCE BRIEF С”, РІРёРєРѕСЂРёСЃС‚РѕРІСѓР№ Р№РѕРіРѕ СЏРє РіРѕР»РѕРІРЅРёР№ РґРѕРєР°Р·РѕРІРёР№ РєРѕРЅС‚РµРєСЃС‚.",
"  - РЇРєС‰Рѕ sourceBriefQuality = curated:",
"  - РІРІР°Р¶Р°Р№ CURATED SOURCES РіРѕР»РѕРІРЅРёРј РґРѕРєР°Р·РѕРІРёРј С€Р°СЂРѕРј;",
"  - OpenAlex РІРёРєРѕСЂРёСЃС‚РѕРІСѓР№ Р»РёС€Рµ СЏРє РґРѕРїРѕРјС–Р¶РЅРёР№ metadata layer;",
"  - РЅРµ РЅР°РґР°РІР°Р№ РїРµСЂРµРІР°РіСѓ OpenAlex, СЏРєС‰Рѕ РІС–РЅ СЃСѓРїРµСЂРµС‡РёС‚СЊ curatedSources;",
"",
  "- РќРµ РІРёРіР°РґСѓР№ РґР¶РµСЂРµР»Р°.",
  "- РќРµ РїСЂРёРїРёСЃСѓР№ РґР¶РµСЂРµР»Р°Рј С‚РѕРіРѕ, С‡РѕРіРѕ РЅРµРјР°С” Сѓ sourceBrief.",
  "- РЇРєС‰Рѕ sourceBrief СЃР»Р°Р±РєРёР№ Р°Р±Рѕ РјС–СЃС‚РёС‚СЊ Р»РёС€Рµ СЂРµС†РµРЅР·С–С—, С„РѕСЂРјСѓР»СЋР№ РїРёС‚Р°РЅРЅСЏ РѕР±РµСЂРµР¶РЅРѕ, Р±РµР· РІСѓР·СЊРєРёС… С‚РІРµСЂРґР¶РµРЅСЊ.",
  "- РЇРєС‰Рѕ sourceSufficiency.sufficientForDraft = false, РЅРµ СЃС‚РІРѕСЂСЋР№ РїРёС‚Р°РЅРЅСЏ РІР·Р°РіР°Р»С–; РїРѕРІРµСЂРЅРё status=\"insufficient_sources\".",
"- РЇРєС‰Рѕ РґР¶РµСЂРµР»Р° СЃР»Р°Р±РєС–, Р°Р»Рµ sufficientForDraft = true, СЃС‚РІРѕСЂРё РїСЂРѕСЃС‚С–С€Рµ РїРёС‚Р°РЅРЅСЏ РЅР° РѕСЃРЅРѕРІС– С‚С–Р»СЊРєРё С‚РёС… С„Р°РєС‚С–РІ, СЏРєС– РїСЂСЏРјРѕ РїС–РґС‚СЂРёРјР°РЅС– sourceBrief.",

  "",

`Current source quality: ${input.sourceBriefQuality || "unknown"}`,
"",
"РџСЂР°РІРёР»Р° quality-aware generation:",
"- РЇРєС‰Рѕ sourceBriefQuality = weak:",
"  - РЅРµ СЃС‚РІРѕСЂСЋР№ РІСѓР·СЊРєРѕСЃРїРµС†С–Р°Р»С–Р·РѕРІР°РЅС– С„Р°РєС‚РѕР»РѕРіС–С‡РЅС– РїРёС‚Р°РЅРЅСЏ;",
"  - СѓРЅРёРєР°Р№ С‚РѕС‡РЅРёС… РґР°С‚, С‡РёСЃРµР» С– СЃСѓРїРµСЂРµС‡Р»РёРІРёС… С‚РІРµСЂРґР¶РµРЅСЊ;",
"  - С„РѕСЂРјСѓР»СЋР№ Р·Р°РіР°Р»СЊРЅРѕР°РєР°РґРµРјС–С‡РЅС– РїРёС‚Р°РЅРЅСЏ;",
"",
"- РЇРєС‰Рѕ sourceBriefStatus = insufficient_sources:",
"  - РЅРµ РІРёРєРѕСЂРёСЃС‚РѕРІСѓР№ retrieval-specific claims;",
"  - СЏРєС‰Рѕ sourceSufficiency.sufficientForDraft = false, РїРѕРІРµСЂРЅРё status=\"insufficient_sources\";",
"  - СЏРєС‰Рѕ draft РґРѕР·РІРѕР»РµРЅРёР№, С„РѕСЂРјСѓР»СЋР№ С‚С–Р»СЊРєРё РґСѓР¶Рµ Р·Р°РіР°Р»СЊРЅРµ РїРёС‚Р°РЅРЅСЏ Р±РµР· РІСѓР·СЊРєРёС… С„Р°РєС‚С–РІ;",
"",
  
  "- РЇРєС‰Рѕ sourceConfidence < 0.5:",
"  - РЅРµ СЃС‚РІРѕСЂСЋР№ РїРёС‚Р°РЅРЅСЏ Р· С‚РѕС‡РЅРёРјРё РґР°С‚Р°РјРё, С‡РёСЃР»Р°РјРё Р°Р±Рѕ СЃРїС–СЂРЅРёРјРё С‚РІРµСЂРґР¶РµРЅРЅСЏРјРё;",
"  - С„РѕСЂРјСѓР»СЋР№ РїРёС‚Р°РЅРЅСЏ С€РёСЂС€Рµ Р№ Р±РµР·РїРµС‡РЅС–С€Рµ;",
"  - explanation РјР°С” Р±СѓС‚Рё РѕР±РµСЂРµР¶РЅРёРј С– РЅРµ СЂРѕР±РёС‚Рё РЅР°РґРјС–СЂРЅРёС… РІРёСЃРЅРѕРІРєС–РІ;",
"",
"- РЇРєС‰Рѕ sourceConfidence >= 0.8:",
"  - РјРѕР¶РЅР° С„РѕСЂРјСѓР»СЋРІР°С‚Рё РєРѕРЅРєСЂРµС‚РЅС–С€С– РїРёС‚Р°РЅРЅСЏ, Р°Р»Рµ РІСЃРµ РѕРґРЅРѕ РЅРµ РІРёС…РѕРґСЊ Р·Р° РјРµР¶С– sourceBrief;",
"",
  
  "РЇРєС‰Рѕ mode = question, СЃС‚РІРѕСЂРё РћР”РќР• РїРёС‚Р°РЅРЅСЏ.",
  `РЇРєС‰Рѕ mode = quiz, СЃС‚РІРѕСЂРё РјС–РЅС–-РІС–РєС‚РѕСЂРёРЅСѓ Р· ${input.count} РїРёС‚Р°РЅСЊ.`,
  "",
  "РџРѕРІРµСЂРЅРё С‚С–Р»СЊРєРё РІР°Р»С–РґРЅРёР№ JSON Р±РµР· Markdown С– Р±РµР· РїРѕСЏСЃРЅРµРЅСЊ РїРѕР·Р° JSON.",
  "",
  "Р”Р»СЏ mode = question С„РѕСЂРјР°С‚ С‚Р°РєРёР№:",
  JSON.stringify(
    {
      categoryId: input.categoryId,
      levelId: String(input.levelId),
      num: 1,
      block: input.block,
      slug: "short-latin-slug",
      data: {
        lang: "ua",
        type: input.type,
        question: "...",
        answers: ["...", "...", "...", "...", "...", "..."],
        correctAnswerIndices: [0],
        explanation: "...",
        topics: ["..."],
        scientificDisciplines: ["..."],
        recommendedLiterature: [],
        provenance: provenanceTemplate,
      },
    },
    null,
    2
  ),
  "",
  "Р”Р»СЏ mode = quiz С„РѕСЂРјР°С‚ С‚Р°РєРёР№:",
  JSON.stringify(
    {
      quizTitle: "...",
      categoryId: input.categoryId,
      levelId: String(input.levelId),
      block: input.block,
      topic: input.topic,
      questions: [
        {
          categoryId: input.categoryId,
          levelId: String(input.levelId),
          num: 1,
          block: input.block,
          slug: "short-latin-slug-1",
          data: {
            lang: "ua",
            type: "SINGLE_CHOICE",
            question: "...",
            answers: ["...", "...", "...", "...", "...", "..."],
            correctAnswerIndices: [0],
            explanation: "...",
            topics: ["..."],
            scientificDisciplines: ["..."],
            recommendedLiterature: [],
            provenance: provenanceTemplate,
          },
        },
      ],
    },
    null,
    2
  ),
  "",
  "РџСЂР°РІРёР»Р°:",
  '- lang Р·Р°РІР¶РґРё "ua".',
  "- Р”Р»СЏ SINGLE_CHOICE Р·Р°РІР¶РґРё СЂС–РІРЅРѕ 6 РІР°СЂС–Р°РЅС‚С–РІ answers.",
  "- correctAnswerIndices СЂР°С…СѓС”С‚СЊСЃСЏ Р· 0.",
  "- РќРµРїСЂР°РІРёР»СЊРЅС– РІР°СЂС–Р°РЅС‚Рё РјР°СЋС‚СЊ Р±СѓС‚Рё РїСЂР°РІРґРѕРїРѕРґС–Р±РЅРёРјРё, Р°Р»Рµ РЅРµРїСЂР°РІРёР»СЊРЅРёРјРё.",
  "- РЈ РјС–РЅС–-РІС–РєС‚РѕСЂРёРЅС– РїРёС‚Р°РЅРЅСЏ РјР°СЋС‚СЊ Р±СѓС‚Рё Р»РѕРіС–С‡РЅРѕ РїРѕСЃР»С–РґРѕРІРЅС–: РІС–Рґ Р±Р°Р·РѕРІРёС… С„Р°РєС‚С–РІ РґРѕ СЃРєР»Р°РґРЅС–С€РёС… РїРѕРЅСЏС‚СЊ.",
  "- num РјР°С” Р·СЂРѕСЃС‚Р°С‚Рё РІС–Рґ 1 РґРѕ count.",
  "- slug РїРёС€Рё Р»Р°С‚РёРЅРёС†РµСЋ, РєРѕСЂРѕС‚РєРѕ, Р±РµР· РїСЂРѕР±С–Р»С–РІ.",
  "- РќРµ РІРёРіР°РґСѓР№ РґР¶РµСЂРµР»Р°. РЇРєС‰Рѕ РґР¶РµСЂРµР»Рѕ РЅРµ РІРїРµРІРЅРµРЅРµ, recommendedLiterature Р·Р°Р»РёС€ [].",
].join("\n");

return [
  {
    json: {
      ...input,
      openAiGenerateBody: {
        model: "gpt-4.1-mini",
        input: prompt,
      },
    },
  },
];
