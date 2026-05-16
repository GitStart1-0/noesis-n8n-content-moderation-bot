# Manual Smoke Tests

## Curated source, no review, document only

```text
/generate_question topic="Київська Русь" categoryId=erudite levelId=1 block=A type=SINGLE_CHOICE db=off doc=on research=on sources=3
```

Expected:

```text
No AI review
Markdown document arrives
sourceBriefQuality = curated
```

## Manual review

```text
/generate_question topic="Київська Русь" categoryId=erudite levelId=1 block=A type=SINGLE_CHOICE db=off doc=on research=on review=on sources=3
```

Expected:

```text
AI review pass
Markdown document arrives
```

## DB pending and approve

```text
/generate_question topic="Київська Русь" categoryId=erudite levelId=1 block=A type=SINGLE_CHOICE db=on doc=on research=on review=on sources=3
```

Expected:

```text
AI review pass
Pending preview with buttons
Approve writes final document with only:
answers, correctAnswerIndices, explanation, question, recommendedLiterature, topics, type
```

## Weak sources with DB on

```text
/generate_question topic="дуже вузька дивна тема без джерел" categoryId=erudite levelId=1 block=A type=SINGLE_CHOICE db=on doc=on research=on sources=3
```

Expected:

```text
OpenAI Generate blocked before draft if sufficientForDb=false
Telegram sends insufficient sources message
```

## Reject branch

Generate a pending question, then press:

```text
❌ Відхилити
```

Expected:

```text
pendingQuestions/{questionId}.status = rejected
final question is not created
```

## Revise branch

Generate a pending question, press:

```text
✏️ Переробити
```

Reply to the bot's revise request:

```text
Зроби питання складнішим і заміни дистрактори на менш очевидні.
```

Expected:

```text
New revised question arrives with a new questionId
Old pending question status is revised
```

