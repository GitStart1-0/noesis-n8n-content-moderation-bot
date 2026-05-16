# Architecture Status

Оцінка відносно документа "Архітектура дешевого й доказового бота-професора Noesis".

## Готово або майже готово

| Блок | Стан | Оцінка |
|---|---:|---:|
| Telegram command parsing | працює | 90% |
| Access control | працює | 95% |
| OpenAlex-first research | базово працює | 65% |
| Curated sources layer | частково працює | 50% |
| sourceBrief | працює з authority оцінкою | 65% |
| sourcePolicy | додано | 70% |
| sourceSufficiency | додано | 75% |
| OpenAI draft generation | працює | 85% |
| JSON validator | працює | 80% |
| AI reviewer / review gate | працює | 85% |
| Pending moderation | працює | 90% |
| Approve final Firestore write | працює | 90% |
| Reject branch | працює | 90% |
| Revise branch | працює | 80-85% |

## Ще не зроблено

| Блок | Стан |
|---|---:|
| sourceBrief cache lookup/write | почато, key готовий |
| PubMed route | не зроблено |
| arXiv route | не зроблено |
| Crossref enrichment | не зроблено |
| Semantic Scholar deep mode | не зроблено |
| provider telemetry / cost caps | частково |
| audit trail із traceId | частково |

## Наступний технічний пріоритет

1. Завершити `sourceBriefCache`.
2. Винести `Load Source Policy` з n8n Code node у `config/source-policy.json`.
3. Винести curated sources з Code node у `curated-sources/`.
4. Додати audit fields: `traceId`, `workflowVersion`, `sourceBriefCacheHit`.

