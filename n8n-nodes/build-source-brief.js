// n8n Code node: Build Source Brief
// Exported from workflows/noesis-telegram-content-moderation.workflow.json

const input = $input.item.json;
const results = input.results || [];

const previous = $("Load Curated Sources").item.json;
const sourcePolicy = previous.sourcePolicy || input.sourcePolicy || {};
const rawCuratedSources = previous.curatedSources || [];

const curatedSources = rawCuratedSources.map((source) => {
  const authority = scoreSourceAuthority(source, sourcePolicy);

  return {
    ...source,
    authorityScore: authority.authorityScore,
    sourceTier: authority.sourceTier,
  };
});

function rebuildAbstract(inverted) {
  if (!inverted || typeof inverted !== "object") return "";

  const words = [];

  for (const [word, positions] of Object.entries(inverted)) {
    for (const pos of positions) {
      words[pos] = word;
    }
  }

  return words.join(" ");
}

function cleanText(value) {
  return String(value || "")
    .replace(/&#13;/g, "")
    .replace(/\\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreItem(item) {
  let score = 0;

  const title = String(item.title || item.display_name || "").toLowerCase();
  const abstractText = rebuildAbstract(item.abstract_inverted_index).toLowerCase();
  const query = String($("Prepare Research Query").item.json.searchQuery || "").toLowerCase();

  if (title.includes(query)) score += 5;
  if (abstractText.includes(query)) score += 3;

  if (item.publication_year) score += 1;
  if (item.doi) score += 1;
  if (item.cited_by_count > 0) score += 1;
  if (item.is_retracted === true) score -= 10;

  if (
    title.startsWith("СЂРµС†РµРЅР·С–СЏ") ||
    abstractText.startsWith("СЂРµС†РµРЅР·С–СЏ") ||
    abstractText.includes("СЂРµС†РµРЅР·С–СЏ РЅР° РІРёРґР°РЅРЅСЏ")
  ) {
    score -= 4;
  }

  return score;
}

function getHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function domainMatches(host, domain) {
  host = String(host || "").toLowerCase();
  domain = String(domain || "").replace(/^www\./, "").toLowerCase();

  return host === domain || host.endsWith("." + domain);
}

function getSourceUrl(source) {
  return (
    source.url ||
    source.landingPageUrl ||
    source.doi ||
    source.id ||
    source.openAlexId ||
    ""
  );
}

function scoreSourceAuthority(source, sourcePolicy) {
  const preferredDomains = sourcePolicy?.preferredDomains || [];
  const strongSourceTypes = sourcePolicy?.strongSourceTypes || [];
  const url = getSourceUrl(source);
  const host = getHost(url);

  let authorityScore = 0.35;
  let sourceTier = "weak_web";

  if (preferredDomains.some(domain => domainMatches(host, domain))) {
    authorityScore += 0.35;
    sourceTier = "preferred_domain";
  }

  if (source.sourceType && strongSourceTypes.includes(source.sourceType)) {
    authorityScore += 0.25;
    sourceTier = "strong_source_type";
  }

  if (source.reliability === "high") {
    authorityScore += 0.2;
    sourceTier = "curated";
  }

  if (source.isRetracted === true) {
    authorityScore = 0;
    sourceTier = "retracted";
  }

  return {
    authorityScore: Math.max(0, Math.min(1, authorityScore)),
    sourceTier
  };
}

const sources = results
  .map((item) => {
    const title = cleanText(item.title || item.display_name || "Р‘РµР· РЅР°Р·РІРё");

    const abstractText = cleanText(
      rebuildAbstract(item.abstract_inverted_index)
    );

    const topics = (item.topics || [])
      .map((t) => t.display_name)
      .filter(Boolean)
      .slice(0, 5);

    const primaryTopic = item.primary_topic?.display_name || null;

    return {
      raw: item,
      score: scoreItem(item),
      title,
      year: item.publication_year || "РЅРµРІС–РґРѕРјРѕ",
      citedBy: item.cited_by_count || 0,
      doi: item.doi || null,
      openAlexId: item.id || null,
      primaryTopic,
      topics,
      abstract: abstractText.slice(0, 800),
    };
  })
  .filter((source) => source.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, Math.min(Number(input.sourceLimit || 3), 5))
  .map((source, index) => {
  const authority = scoreSourceAuthority(
    {
      ...source,
      sourceType: "peer_reviewed_article",
      url: source.openAlexId || source.doi,
      isRetracted: source.raw?.is_retracted === true,
    },
    sourcePolicy
  );

  return {
    index: index + 1,
    title: source.title,
    year: source.year,
    citedBy: source.citedBy,
    doi: source.doi,
    openAlexId: source.openAlexId,
    primaryTopic: source.primaryTopic,
    topics: source.topics,
    abstract: source.abstract,
    authorityScore: authority.authorityScore,
    sourceTier: authority.sourceTier,
  };
});

const curatedBrief = curatedSources.map((source, index) => {
  return [
    `[C${index + 1}] ${source.title}`,
    source.author ? `Author: ${source.author}` : null,
    source.year ? `Year: ${source.year}` : null,
    source.place || source.publisher
      ? `Publication: ${[source.place, source.publisher].filter(Boolean).join(", ")}`
      : null,
    `Type: ${source.sourceType}`,
    `Reliability: ${source.reliability}`,
    source.note ? `Note: ${source.note}` : null,
    source.evidenceNotes?.length
      ? `Evidence notes:\n- ${source.evidenceNotes.join("\n- ")}`
      : null
  ]
    .filter(Boolean)
    .join("\n");
}).join("\n\n---\n\n");

const openAlexBrief = sources.length
  ? sources
      .map((source) => {
        return [
          `[${source.index}] ${source.title}`,
          `Year: ${source.year}`,
          `Citations: ${source.citedBy}`,
          source.doi ? `DOI: ${source.doi}` : null,
          source.openAlexId ? `OpenAlex: ${source.openAlexId}` : null,
          source.primaryTopic ? `Primary topic: ${source.primaryTopic}` : null,
          source.topics?.length ? `Topics: ${source.topics.join(", ")}` : null,
          source.abstract ? `Abstract: ${source.abstract}` : null,
        ]
          .filter(Boolean)
          .join("\n");
      })
      .join("\n\n---\n\n")
  : "";

const sourceBrief = [
  curatedBrief ? "CURATED SOURCES:\n" + curatedBrief : null,
  openAlexBrief ? "OPENALEX SOURCES:\n" + openAlexBrief : null
]
  .filter(Boolean)
  .join("\n\n====================\n\n");
    
const reviewLikeCount = sources.filter((s) =>
  String(s.abstract || "").toLowerCase().includes("СЂРµС†РµРЅР·С–СЏ РЅР° РІРёРґР°РЅРЅСЏ")
).length;

const weakTopicCount = sources.filter((s) =>
  ["Military Technology and Strategies", "Eastern European Communism and Reforms"]
    .includes(s.primaryTopic)
).length;

const allSources = [...curatedSources, ...sources];

const strongSources = allSources.filter((source) =>
  Number(source.authorityScore || 0) >= 0.65 ||
  ["curated", "strong_source_type", "preferred_domain"].includes(source.sourceTier)
);

const hasCurated = curatedSources.some((source) => source.sourceTier === "curated");
const minSources = Number(sourcePolicy.minSources || 2);
const allowCuratedSingleSource = sourcePolicy.allowCuratedSingleSource === true;

let sourceBriefQuality = "insufficient";

if (allSources.length === 0) {
  sourceBriefQuality = "insufficient";
} else if (hasCurated && allowCuratedSingleSource && strongSources.length >= 1) {
  sourceBriefQuality = "curated";
} else if (strongSources.length >= minSources) {
  sourceBriefQuality = "ok";
} else if (strongSources.length >= 1) {
  sourceBriefQuality = "weak";
}

if (reviewLikeCount >= 2 || weakTopicCount >= 2) {
  sourceBriefQuality = sourceBriefQuality === "ok" ? "weak" : sourceBriefQuality;
}

let sourceConfidence = 0.3;

if (sourceBriefQuality === "curated") {
  sourceConfidence = 0.85;
} else if (sourceBriefQuality === "ok") {
  sourceConfidence = 0.7;
} else if (sourceBriefQuality === "weak") {
  sourceConfidence = 0.45;
} else if (sourceBriefQuality === "insufficient") {
  sourceConfidence = 0.15;
}

if (curatedSources.length >= 2) {
  sourceConfidence += 0.05;
}

if (sources.some((s) => s.doi)) {
  sourceConfidence += 0.05;
}

if (sources.some((s) => Number(s.citedBy || 0) > 0)) {
  sourceConfidence += 0.05;
}

if (reviewLikeCount >= 2) {
  sourceConfidence -= 0.1;
}

if (weakTopicCount >= 2) {
  sourceConfidence -= 0.1;
}

sourceConfidence = Math.max(
  0,
  Math.min(1, Number(sourceConfidence.toFixed(2)))
);

return [
  {
    json: {
      ...$("Prepare Research Query").item.json,
      retrievedSources: sources,
      curatedSources,
      curatedSourceCount: curatedSources.length,
      hasCuratedSources: curatedSources.length > 0,
      sourceBrief,
      sourceBriefStatus:
        sourceBriefQuality === "insufficient"
          ? "insufficient_sources"
          : sourceBriefQuality,
      sourceBriefQuality,
      sourceConfidence,
      sourceBriefWarnings: {
        reviewLikeCount,
        weakTopicCount,
      },
      sourcePolicy,
      sourceAuthoritySummary: {
        totalSources: allSources.length,
        strongSources: strongSources.length,
        minSources,
        hasCurated
      }
    }
  }
];
