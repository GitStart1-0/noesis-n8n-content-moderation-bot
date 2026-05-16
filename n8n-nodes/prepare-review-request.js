// n8n Code node: Prepare Review Request
// Exported from workflows/noesis-telegram-content-moderation.workflow.json

const input = $input.item.json;

const generatedText = String(input.message?.text || "").trim();

let generatedJson;

try {
  generatedJson = JSON.parse(generatedText);
} catch (error) {
  return [
    {
      json: {
        ok: false,
        reviewError: "AI output is not valid JSON before review.",
        generatedText,
        telegramChatId: input.message?.chat?.id
      }
    }
  ];
}

const parseOptions = $("Parse Generate Options").item.json;


let buildSourceBrief = null;

try {
  if ($("Build Source Brief").isExecuted) {
    buildSourceBrief = $("Build Source Brief").item.json;
  }
} catch (error) {
  buildSourceBrief = null;
}

const sourceBrief =
  input.sourceBrief ||
  parseOptions.sourceBrief ||
  buildSourceBrief?.sourceBrief ||
  "";

const sourceBriefQuality =
  input.sourceBriefQuality ||
  parseOptions.sourceBriefQuality ||
  buildSourceBrief?.sourceBriefQuality ||
  "none";

const sourceBriefStatus =
  input.sourceBriefStatus ||
  parseOptions.sourceBriefStatus ||
  buildSourceBrief?.sourceBriefStatus ||
  "none";

const sourceAuthoritySummary =
  input.sourceAuthoritySummary ||
  input.reviewDecision?.sourceAuthoritySummary ||
  buildSourceBrief?.sourceAuthoritySummary ||
  null;

const sourcePolicy =
  input.sourcePolicy ||
  buildSourceBrief?.sourcePolicy ||
  null;


const reviewPrompt = [
  "РўРё вЂ” Noesis Source-Backed Reviewer.",
  "",
  "РўРІРѕС” Р·Р°РІРґР°РЅРЅСЏ вЂ” РќР• РїРµСЂРµРїРёСЃСѓРІР°С‚Рё РїРёС‚Р°РЅРЅСЏ, Р° РїРµСЂРµРІС–СЂРёС‚Рё Р№РѕРіРѕ СЏРєС–СЃС‚СЊ.",
  "",
  `Review reason: ${input.reviewDecision?.reviewReason || "unknown"}`,
  `Source confidence: ${input.reviewDecision?.sourceConfidence ?? "unknown"}`,
  `Source status: ${sourceBriefStatus}`,
`Source authority summary: ${JSON.stringify(sourceAuthoritySummary)}`,
`Source discipline: ${sourcePolicy?.discipline || input.reviewDecision?.sourcePolicyDiscipline || "unknown"}`,
  `Should review: ${input.reviewDecision?.shouldReview}`,
  "РџРµСЂРµРІС–СЂ:",
  "- С„Р°РєС‚РѕР»РѕРіС–С‡РЅСѓ РєРѕСЂРµРєС‚РЅС–СЃС‚СЊ;",
  "- РІС–РґРїРѕРІС–РґРЅС–СЃС‚СЊ sourceBrief;",
  "- РґРІРѕР·РЅР°С‡РЅС–СЃС‚СЊ РїСЂР°РІРёР»СЊРЅРѕС— РІС–РґРїРѕРІС–РґС–;",
  "- СЏРєС–СЃС‚СЊ РґРёСЃС‚СЂР°РєС‚РѕСЂС–РІ;",
  "- СЏРєС–СЃС‚СЊ РїРѕСЏСЃРЅРµРЅРЅСЏ;",
  "- РїРµРґР°РіРѕРіС–С‡РЅСѓ С†С–РЅРЅС–СЃС‚СЊ;",
  "- СЂРёР·РёРє hallucination;",
  "- С‡Рё РЅРµ Р·СЂРѕР±Р»РµРЅРѕ С‚РІРµСЂРґР¶РµРЅРЅСЏ, СЏРєРёС… РЅРµРјР°С” Сѓ sourceBrief.",
  "",
  `Source brief quality: ${sourceBriefQuality}`,
  "",
  
  "SOURCE BRIEF:",
  sourceBrief || "none",
  "",
  "GENERATED QUESTION JSON:",
  JSON.stringify(generatedJson, null, 2),
  "",
  "РџРѕРІРµСЂРЅРё С‚С–Р»СЊРєРё РІР°Р»С–РґРЅРёР№ JSON Р±РµР· Markdown:",
  JSON.stringify(
    {
      approved: true,
      confidence: 0.85,
      factualReliability: 0.9,
      pedagogicalQuality: 0.8,
      distractorQuality: 0.8,
      ambiguityRisk: 0.1,
      hallucinationRisk: 0.1,
      verdict: "pass",
      issues: [],
      recommendations: []
    },
    null,
    2
  ),
  "",
  "РџСЂР°РІРёР»Р° СЂС–С€РµРЅРЅСЏ:",
  "- verdict = pass, СЏРєС‰Рѕ РїРёС‚Р°РЅРЅСЏ РјРѕР¶РЅР° РїРµСЂРµРґР°С‚Рё РЅР° РјРѕРґРµСЂР°С†С–СЋ.",
  "- verdict = revise, СЏРєС‰Рѕ РїРёС‚Р°РЅРЅСЏ РїРѕС‚СЂРµР±СѓС” РїСЂР°РІРєРё, Р°Р»Рµ РЅРµ С” РїРѕРІРЅС–СЃС‚СЋ С…РёР±РЅРёРј.",
  "- verdict = reject, СЏРєС‰Рѕ РїРёС‚Р°РЅРЅСЏ С„Р°РєС‚РѕР»РѕРіС–С‡РЅРѕ РЅРµР±РµР·РїРµС‡РЅРµ Р°Р±Рѕ РІС–РґРїРѕРІС–РґСЊ РґРІРѕР·РЅР°С‡РЅР°.",
  "- РЇРєС‰Рѕ sourceBriefQuality = insufficient Р°Р±Рѕ sourceBriefStatus = insufficient_sources, verdict РќР• РјРѕР¶Рµ Р±СѓС‚Рё pass РґР»СЏ С„Р°РєС‚РѕР»РѕРіС–С‡РЅРѕРіРѕ РїРёС‚Р°РЅРЅСЏ.",
  "- РЇРєС‰Рѕ sourceBriefQuality = weak, verdict = pass РјРѕР¶Р»РёРІРёР№ С‚С–Р»СЊРєРё РґР»СЏ РґСѓР¶Рµ Р·Р°РіР°Р»СЊРЅРѕРіРѕ РїРёС‚Р°РЅРЅСЏ, СЏРєРµ РїСЂСЏРјРѕ РїС–РґС‚СЂРёРјР°РЅРµ sourceBrief.",
  "- РЇРєС‰Рѕ sourceBrief РЅРµ РјС–СЃС‚РёС‚СЊ РїСЂСЏРјРѕС— РїС–РґС‚СЂРёРјРєРё РїСЂР°РІРёР»СЊРЅРѕС— РІС–РґРїРѕРІС–РґС– Р°Р±Рѕ РїРѕСЏСЃРЅРµРЅРЅСЏ, verdict РјР°С” Р±СѓС‚Рё revise Р°Р±Рѕ reject.",
  "- РЇРєС‰Рѕ РїСЂР°РІРёР»СЊРЅР° РІС–РґРїРѕРІС–РґСЊ РјРѕР¶Рµ Р±СѓС‚Рё РЅРµ С”РґРёРЅРѕСЋ, verdict РјР°С” Р±СѓС‚Рё revise Р°Р±Рѕ reject."
].join("\n");

return [
  {
    json: {
      ...input,
      generatedJson,
      reviewPrompt
    }
  }
];
