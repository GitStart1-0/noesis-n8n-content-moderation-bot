// n8n Code node: Prepare Cached Source Brief
// Exported from workflows/noesis-telegram-content-moderation.workflow.json

const cached = $input.item.json;

return [
  {
    json: {
      ...$("Build Source Cache Key").item.json,
      sourceBrief: cached.sourceBrief,
      sourceBriefStatus: cached.sourceBriefStatus,
      sourceBriefQuality: cached.sourceBriefQuality,
      sourceConfidence: cached.sourceConfidence,
      curatedSources: cached.curatedSources || [],
      retrievedSources: cached.retrievedSources || [],
      sourceAuthoritySummary: cached.sourceAuthoritySummary || null,
      sourcePolicy: cached.sourcePolicy || $("Build Source Cache Key").item.json.sourcePolicy || null,
      sourceBriefCacheKey: cached.sourceBriefCacheKey || $("Build Source Cache Key").item.json.sourceBriefCacheKey,
      sourceBriefCacheHit: true,
      sourceBriefCachedAt: cached.cachedAt || null
    }
  }
];
