# Source Quality Policy

## Принцип

LLM не має самостійно вирішувати, що є авторитетним джерелом. n8n workflow має передавати структуровану `sourcePolicy`, а `Build Source Brief` має рахувати `sourceBriefQuality`, `sourceConfidence` і `sourceAuthoritySummary`.

## Якість джерел

```text
curated       curated джерело або сильний предметний корпус
ok            достатньо сильних джерел за політикою дисципліни
weak          є джерела, але вони слабкі або непрямі
insufficient  джерел немає або вони не підтримують питання
```

## Sufficiency

`sourceSufficiency` розділяє два рівні:

```text
sufficientForDraft
sufficientForDb
```

Правило:

- `db=on` і `sufficientForDb=false` блокує генерацію до OpenAI.
- `db=off` може дозволяти draft, але reviewer має бути суворішим.

## Рекомендовані пріоритети джерел

Астрономія:

- NASA
- ESA
- IAU
- JPL
- NASA ADS

Філософія:

- Stanford Encyclopedia of Philosophy
- Internet Encyclopedia of Philosophy
- Project Gutenberg
- Wikisource
- Perseus Digital Library

Історія:

- curated monographs
- академічні енциклопедії
- peer-reviewed articles
- primary public-domain texts

Біомедицина:

- PubMed
- PMC OA
- WHO
- NIH
- CDC
- Cochrane

