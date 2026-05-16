# Firestore Schema

## Pending questions

```text
pendingQuestions/{questionId}
```

Очікувані службові поля:

```text
questionId
status
targetCollectionPath
targetLevelDocumentPath
documentData
previewText
telegramChatId
originalTelegramMessageId
generationOptions
createdAt
updatedAt
```

`aiReview` не записується в pending-документ і не записується в `documentData`.

## Final question document

```text
/{categoryId}/{levelId}/questions/{questionId}
```

У фінальному документі мають бути тільки ігрові поля:

```text
answers
correctAnswerIndices
explanation
question
recommendedLiterature
topics
type
```

Не записувати:

```text
questionId
categoryId
levelId
lang
num
block
slug
source
status
createdAt
updatedAt
approvedAt
telegramChatId
generationOptions
aiReview
```

## Source brief cache

Планована колекція:

```text
sourceBriefCache/{sourceBriefCacheKey}
```

Поля:

```text
sourceBriefCacheKey
sourceBriefCacheKeyParts
sourceBrief
sourceBriefStatus
sourceBriefQuality
sourceConfidence
sourceAuthoritySummary
sourcePolicy
curatedSources
retrievedSources
cachedAt
expiresAt
```

