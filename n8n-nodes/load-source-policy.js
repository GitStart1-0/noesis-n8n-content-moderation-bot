// n8n Code node: Load Source Policy
// Exported from workflows/noesis-telegram-content-moderation.workflow.json

const item = $input.first().json;

function norm(value) {
  return String(value || "").toLowerCase().trim();
}

const topic = norm(item.topic);
const categoryId = norm(item.categoryId);

function detectDiscipline(topic, categoryId) {
  if (
    /Р°СЃС‚СЂРѕРЅРѕРј|РєРѕСЃРјРѕСЃ|РїР»Р°РЅРµС‚|Р·РѕСЂ|РіР°Р»Р°РєС‚РёРє|С‚РµР»РµСЃРєРѕРї|СЃРѕРЅСЏС‡РЅ|РјС–СЃСЏС†|РјР°СЂСЃ|СЋРїС–С‚РµСЂ|РµРєР·РѕРїР»Р°РЅРµС‚/.test(topic)
  ) {
    return "astronomy";
  }

  if (
    /С„С–Р»РѕСЃРѕС„|Р°СЂС–СЃС‚РѕС‚|РїР»Р°С‚РѕРЅ|РєР°РЅС‚|РіРµРіРµР»СЊ|РЅС–С†С€Рµ|РµС‚РёРє|РјРµС‚Р°С„С–Р·РёРє|РµРїС–СЃС‚РµРјРѕР»РѕРі/.test(topic)
    || categoryId === "philosophy"
  ) {
    return "philosophy";
  }

  if (
    /РєРёС—РІСЃСЊРєР° СЂСѓСЃСЊ|СЂСѓСЃСЊ|СЃРµСЂРµРґРЅСЊРѕРІС–С‡|РєРЅСЏР·|Р»С–С‚РѕРїРёСЃ|С–СЃС‚РѕСЂ/.test(topic)
    || categoryId === "culture"
    || categoryId === "erudite"
  ) {
    return "history";
  }

  if (
    /РјРµРґРёС†Рё|Р±С–РѕР»РѕРі|РїСЃРёС…РѕР»РѕРі|РµРїС–РґРµРј|РєР»С–РЅС–С‡|Р·РґРѕСЂРѕРІ/.test(topic)
  ) {
    return "biomedicine";
  }

  if (
    /РјР°С‚РµРјР°С‚|С„С–Р·РёРє|Р°Р»РіРѕСЂРёС‚Рј|С€С‚СѓС‡РЅ|ai|machine learning|СЃС‚Р°С‚РёСЃС‚/.test(topic)
    || categoryId === "science"
  ) {
    return "science";
  }

  return "general";
}

const discipline = detectDiscipline(topic, categoryId);

const policies = {
  astronomy: {
    discipline: "astronomy",
    minSources: 2,
    preferredProviderOrder: ["official", "openalex", "crossref"],
    preferredDomains: [
      "nasa.gov",
      "science.nasa.gov",
      "data.nasa.gov",
      "api.nasa.gov",
      "esa.int",
      "cosmos.esa.int",
      "iau.org",
      "ssd.jpl.nasa.gov",
      "adsabs.harvard.edu"
    ],
    strongSourceTypes: ["official_agency", "peer_reviewed_article", "curated_reference"],
    allowOfficialSingleSource: true,
    allowCuratedSingleSource: true,
    quotePolicy: "short_excerpt_or_public_domain_only"
  },

  philosophy: {
    discipline: "philosophy",
    minSources: 1,
    preferredProviderOrder: ["curated", "reference", "openalex"],
    preferredDomains: [
      "plato.stanford.edu",
      "iep.utm.edu",
      "gutenberg.org",
      "wikisource.org",
      "uk.wikisource.org",
      "perseus.tufts.edu",
      "archive.org"
    ],
    strongSourceTypes: ["curated_reference", "primary_text_public_domain", "peer_reviewed_article"],
    allowOfficialSingleSource: false,
    allowCuratedSingleSource: true,
    quotePolicy: "public_domain_or_short_attributed_excerpt_only"
  },

  history: {
    discipline: "history",
    minSources: 2,
    preferredProviderOrder: ["curated", "openalex", "crossref", "reference"],
    preferredDomains: [
      "litopys.org.ua",
      "history.org.ua",
      "encyclopediaofukraine.com",
      "jstor.org",
      "cambridge.org",
      "oxfordreference.com",
      "openalex.org"
    ],
    strongSourceTypes: ["curated_monograph", "peer_reviewed_article", "academic_reference", "primary_text_public_domain"],
    allowOfficialSingleSource: false,
    allowCuratedSingleSource: true,
    quotePolicy: "public_domain_or_short_attributed_excerpt_only"
  },

  biomedicine: {
    discipline: "biomedicine",
    minSources: 2,
    preferredProviderOrder: ["pubmed", "official", "openalex", "crossref"],
    preferredDomains: [
      "pubmed.ncbi.nlm.nih.gov",
      "pmc.ncbi.nlm.nih.gov",
      "who.int",
      "nih.gov",
      "cdc.gov",
      "cochranelibrary.com"
    ],
    strongSourceTypes: ["systematic_review", "clinical_guideline", "peer_reviewed_article", "official_health_agency"],
    allowOfficialSingleSource: false,
    allowCuratedSingleSource: false,
    preprintsAllowed: false,
    requiresReview: true,
    quotePolicy: "short_excerpt_only"
  },

  science: {
    discipline: "science",
    minSources: 2,
    preferredProviderOrder: ["openalex", "crossref", "arxiv"],
    preferredDomains: [
      "nature.com",
      "science.org",
      "springer.com",
      "sciencedirect.com",
      "arxiv.org",
      "openalex.org"
    ],
    strongSourceTypes: ["peer_reviewed_article", "official_agency", "academic_reference"],
    allowOfficialSingleSource: true,
    allowCuratedSingleSource: true,
    quotePolicy: "short_excerpt_or_public_domain_only"
  },

  general: {
    discipline: "general",
    minSources: 2,
    preferredProviderOrder: ["curated", "openalex", "crossref"],
    preferredDomains: [
      "openalex.org",
      "britannica.com",
      "encyclopedia.com",
      "wikisource.org",
      "gutenberg.org"
    ],
    strongSourceTypes: ["curated_reference", "peer_reviewed_article", "academic_reference", "official_source"],
    allowOfficialSingleSource: true,
    allowCuratedSingleSource: true,
    quotePolicy: "short_excerpt_or_public_domain_only"
  }
};

const sourcePolicy = {
  ...(policies[discipline] || policies.general),
  rejectSourceTypes: [
    "content_farm",
    "seo_blog",
    "ai_generated_page",
    "unsourced_wiki_copy",
    "forum_post",
    "social_media_post"
  ],
  sufficiencyRules: {
    insufficientIfNoSources: true,
    insufficientIfNoDirectSupport: true,
    weakIfOnlyOneNonCuratedSource: true,
    minimumConfidenceForOk: 0.65,
    minimumConfidenceForWeak: 0.45
  }
};

return [
  {
    json: {
      ...item,
      sourcePolicy
    }
  }
];

