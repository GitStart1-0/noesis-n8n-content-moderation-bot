// n8n Code node: Decide Source Sufficiency
// Exported from workflows/noesis-telegram-content-moderation.workflow.json

const input = $input.item.json;

const sourceBriefQuality = input.sourceBriefQuality || "none";
const sourceBriefStatus = input.sourceBriefStatus || "none";
const sourceConfidence = Number(input.sourceConfidence ?? 0);

const sourceAuthoritySummary = input.sourceAuthoritySummary || {};
const sourcePolicy = input.sourcePolicy || {};

const saveToDb = input.saveToDb === true;
const researchEnabled = input.researchEnabled === true;

const totalSources = Number(sourceAuthoritySummary.totalSources || 0);
const strongSources = Number(sourceAuthoritySummary.strongSources || 0);
const minSources = Number(sourceAuthoritySummary.minSources || sourcePolicy.minSources || 2);
const hasCurated = sourceAuthoritySummary.hasCurated === true;

const isInsufficient =
  sourceBriefQuality === "insufficient" ||
  sourceBriefStatus === "insufficient_sources" ||
  totalSources === 0 ||
  sourceConfidence < 0.45;

const isWeak =
  sourceBriefQuality === "weak" ||
  sourceBriefStatus === "weak" ||
  sourceConfidence < 0.65 ||
  strongSources < minSources;

const sufficientForDraft =
  !researchEnabled ||
  !isInsufficient ||
  hasCurated;

const sufficientForDb =
  !researchEnabled ||
  (
    !isInsufficient &&
    !isWeak &&
    sourceConfidence >= 0.65 &&
    (strongSources >= minSources || hasCurated)
  );

let reason = "source_sufficient";

if (researchEnabled && isInsufficient && saveToDb) {
  reason = "insufficient_sources_for_db";
} else if (researchEnabled && isInsufficient) {
  reason = "insufficient_sources_for_draft_with_review";
} else if (researchEnabled && isWeak && saveToDb) {
  reason = "weak_sources_for_db";
} else if (researchEnabled && isWeak) {
  reason = "weak_sources_for_draft_with_review";
}

return [
  {
    json: {
      ...input,
      sourceSufficiency: {
        sufficientForDraft,
        sufficientForDb,
        reason,
        researchEnabled,
        saveToDb,
        sourceBriefQuality,
        sourceBriefStatus,
        sourceConfidence,
        totalSources,
        strongSources,
        minSources,
        hasCurated,
        discipline: sourcePolicy.discipline || null
      }
    }
  }
];

