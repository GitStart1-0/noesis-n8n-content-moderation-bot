# Generate Question Prompt Notes

Обов'язкові блоки в prompt:

```text
SOURCE BRIEF
SOURCE SUFFICIENCY
sourceBriefQuality
sourceConfidence
```

Ключові правила:

```text
Якщо sourceSufficiency.sufficientForDraft = false, поверни JSON зі status="insufficient_sources" і не вигадуй питання.
Якщо sourceSufficiency.sufficientForDb = false, питання може бути тільки draft для review, без претензії на готовність до БД.
Якщо sourceBriefQuality = curated, CURATED SOURCES є головним доказовим шаром.
Не вигадуй джерела.
Не приписуй джерелам того, чого немає у sourceBrief.
```

Для `SINGLE_CHOICE`:

```text
answers рівно 6
correctAnswerIndices рівно 1
correctAnswerIndices рахується з 0
```

