// n8n Code node: Decide Review Need
// Exported from workflows/noesis-telegram-content-moderation.workflow.json

const input = $input.item.json;

const parseOptions = $("Parse Generate Options").item.json;

const reviewEnabled = parseOptions.reviewEnabled === true;
const autoReview = parseOptions.autoReview !== false;

const saveToDb = parseOptions.saveToDb === true;
const researchEnabled = parseOptions.researchEnabled === true;

let sourceBriefQuality = "none";
let sourceBriefStatus = "none";
let sourceConfidence = null;
let sourcePolicy = {};
let sourceAuthoritySummary = null;

try {
  const brief = $("Build Source Brief").item.json;

  sourceBriefQuality = brief.sourceBriefQuality || "none";
  sourceBriefStatus = brief.sourceBriefStatus || "none";
  sourcePolicy = brief.sourcePolicy || {};
  sourceAuthoritySummary = brief.sourceAuthoritySummary || null;

  if (typeof brief.sourceConfidence === "number") {
    sourceConfidence = brief.sourceConfidence;
  } else if (brief.sourceConfidence !== undefined && brief.sourceConfidence !== null) {
    const parsed = Number(brief.sourceConfidence);
    sourceConfidence = Number.isFinite(parsed) ? parsed : null;
  }
} catch (error) {
  sourceBriefQuality = "none";
  sourceBriefStatus = "none";
  sourceConfidence = null;
  sourcePolicy = {};
  sourceAuthoritySummary = null;
}

let generatedJson = null;
let questionType = parseOptions.type || "SINGLE_CHOICE";

try {
  generatedJson = JSON.parse(input.message?.text || "{}");
  questionType = generatedJson?.data?.type || questionType;
} catch (error) {
  // РЇРєС‰Рѕ JSON РЅРµ СЂРѕР·С–Р±СЂР°РІСЃСЏ, РЅРµС…Р°Р№ РґР°Р»С– С†Рµ Р·Р»РѕРІРёС‚СЊ Parse Question JSON.
}

const complexTypes = [
  "READING_COMPREHENSION",
  "SLIDER_SCALE",
  "COMPARISON",
  "TEN_FACTS",
  "MATCHING",
  "SEQUENCE"
];

const isComplexType = complexTypes.includes(questionType);

const isWeakSource =
  sourceBriefQuality === "weak" ||
  sourceBriefQuality === "insufficient" ||
  sourceBriefStatus === "weak" ||
  sourceBriefStatus === "insufficient_sources" ||
  (typeof sourceConfidence === "number" && sourceConfidence < 0.55);

const sourcePolicyRequiresReview = sourcePolicy.requiresReview === true;

const highRisk =
  saveToDb ||
  isWeakSource ||
  isComplexType ||
  sourcePolicyRequiresReview ||
  (researchEnabled && sourceBriefQuality !== "curated" && sourceBriefQuality !== "ok");

let shouldReview = false;
let reviewReason = "review_not_needed";

if (reviewEnabled) {
  shouldReview = true;
  reviewReason = "manual_review_on";
} else if (autoReview && highRisk) {
  shouldReview = true;

  if (saveToDb) {
    reviewReason = "db_on_requires_review";
  } else if (isWeakSource) {
    reviewReason = "weak_or_insufficient_sources";
  } else if (sourcePolicyRequiresReview) {
    reviewReason = "source_policy_requires_review";
  } else if (isComplexType) {
    reviewReason = "complex_question_type";
  } else {
    reviewReason = "risk_based_review";
  }
}

return [
  {
    json: {
      ...input,
      reviewDecision: {
        shouldReview,
        reviewReason,
        reviewEnabled,
        autoReview,
        saveToDb,
        researchEnabled,
        sourceBriefQuality,
        sourceBriefStatus,
        sourceConfidence,
        sourceAuthoritySummary,
        sourcePolicyDiscipline: sourcePolicy.discipline || null,
        sourcePolicyRequiresReview,
        questionType
      }
    }
  }
];

