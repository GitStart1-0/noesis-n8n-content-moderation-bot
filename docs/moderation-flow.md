# Moderation Flow

## Generate question

```text
Telegram Trigger
-> IF Access
-> Parse Generate Options
-> Load Source Policy
-> IF Research Enabled
-> Prepare Research Query
-> Build Source Cache Key
-> Get Source Brief Cache
-> Load Curated Sources / OpenAlex Search
-> Build Source Brief
-> Decide Source Sufficiency
-> IF Sufficient For DB Or Draft
-> Prepare OpenAI Generate Request
-> OpenAI Generate via Prompt
-> Prepare AI JSON
-> Decide Review Need
-> IF Should Review
```

## AI review

Correct structure:

```text
Attach Review Result
-> IF Review Passed
   true:
     -> Send Review Summary
     -> Parse Question JSON
   false:
     -> Send Review Failed
```

`Send Review Summary` must not be connected before `Parse Question JSON`.

## Moderation actions

Approve:

```text
approve callback
-> Get Pending Question
-> Prepare Approved Question
-> Save Approved Question
-> Send Approve Success
```

Reject:

```text
reject callback
-> Get Pending Question for Reject
-> Prepare Rejected Question
-> Update Pending as Rejected
-> Send Reject Success
```

Revise:

```text
revise callback
-> Get Pending Question for Revise
-> Prepare Revision Request
-> Update Pending as Needs Revision
-> Send Revision Request
```

Reply with revision comment:

```text
IF Revision Reply
-> Parse Revision Reply
-> Get Pending Question for Revision Comment
-> Prepare Revision Comment
-> Update Pending with Revision Comment
-> Prepare OpenAI Revision Request
-> OpenAI Revise Question
-> Prepare Revised AI JSON
-> Parse Question JSON
```

