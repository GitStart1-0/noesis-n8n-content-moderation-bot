# Review Question Prompt Notes

Reviewer перевіряє якість, а не переписує питання.

Обов'язкові блоки:

```text
Review reason
Source confidence
Source status
Source authority summary
Source discipline
SOURCE BRIEF
GENERATED QUESTION JSON
```

Правила:

```text
verdict = pass, якщо питання можна передати на модерацію.
verdict = revise, якщо питання потребує правки, але не є повністю хибним.
verdict = reject, якщо питання фактологічно небезпечне або відповідь двозначна.
Якщо sourceBriefQuality = insufficient або sourceBriefStatus = insufficient_sources, verdict НЕ може бути pass для фактологічного питання.
Якщо sourceBriefQuality = weak, verdict = pass можливий тільки для дуже загального питання, яке прямо підтримане sourceBrief.
Якщо sourceBrief не містить прямої підтримки правильної відповіді або пояснення, verdict має бути revise або reject.
```

