# Revise Question Prompt Notes

Revision model переписує одне питання після human feedback.

Правила:

```text
Зберігати categoryId, levelId, block, type, якщо користувач явно не просить змінити.
Враховувати revisionComment.
Не переносити aiReview у documentData.
Повернути валідний JSON питання в тому самому форматі, що generate-question.
Якщо researchEnabled=true, зберегти provenance і не виходити за межі sourceBrief.
```

