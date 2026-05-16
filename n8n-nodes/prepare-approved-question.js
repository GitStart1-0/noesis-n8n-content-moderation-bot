// n8n Code node: Prepare Approved Question
// Exported from workflows/noesis-telegram-content-moderation.workflow.json

const pending = $input.first().json;

if (!pending.documentData) {
  return [
    {
      json: {
        ok: false,
        error: "РЈ pendingQuestions РЅРµРјР°С” РїРѕР»СЏ documentData.",
        pending
      }
    }
  ];
}

const d = pending.documentData;

const approvedQuestion = {
  type: d.type,
  question: d.question,
  answers: d.answers,
  correctAnswerIndices: d.correctAnswerIndices,
  explanation: d.explanation,
  topics: d.topics,
  scientificDisciplines: d.scientificDisciplines,
  recommendedLiterature: d.recommendedLiterature || [],
  provenance: d.provenance
};

return [
  {
    json: {
      questionId: pending.questionId || d.questionId,
      telegramChatId: pending.telegramChatId,
      targetCollectionPath: pending.targetCollectionPath,
      targetLevelDocumentPath: pending.targetLevelDocumentPath,

      answers: d.answers,
      correctAnswerIndices: Array.isArray(d.correctAnswerIndices)
        ? d.correctAnswerIndices.map(Number)
        : [],
      explanation: d.explanation,
      question: d.question,
      recommendedLiterature: d.recommendedLiterature || [],
      topics: d.topics,
      type: d.type
    }
  }
];



