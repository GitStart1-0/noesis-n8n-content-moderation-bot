# Noesis Telegram Content Moderation Bot

Проєкт n8n Telegram-бота для Noesis / NoesisQuiz.

Бот генерує освітні питання, будує доказовий контекст із джерел, запускає AI-рецензію за потреби, надсилає питання на Telegram-модерацію і після підтвердження записує чистий документ у Firestore.

## Поточний статус

MVP moderation-cycle працює:

- Telegram command parsing
- OpenAlex + curated sourceBrief
- source policy / source sufficiency
- AI reviewer для ризикових питань
- approve / reject / revise цикл
- pendingQuestions у Firestore
- фінальний запис у `/categoryId/levelId/questions/questionId`

Орієнтовна готовність:

- Telegram/n8n MVP: 75-80%
- повна архітектура з research/cache/provider routing: 50-55%

## Роль GitHub

GitHub використовується як source of truth для:

- workflow backup
- Code node snippets
- source policy
- curated sources
- prompts
- документації
- ручних тестів

Firestore використовується для runtime-даних:

- `pendingQuestions`
- `sourceBriefCache`
- `researchArtifacts`
- `auditLogs`

## Структура

```text
workflows/          n8n workflow exports
n8n-nodes/          Code node snippets and notes
config/             source policy and runtime configuration
curated-sources/    curated bibliography/evidence packs
prompts/            generator/reviewer/revision prompts
docs/               architecture and implementation notes
tests/manual/       Telegram smoke tests
```

