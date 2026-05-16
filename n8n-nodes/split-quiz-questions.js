// n8n Code node: Split Quiz Questions
// Exported from workflows/noesis-telegram-content-moderation.workflow.json

const input = $input.first().json;
const quiz = input.quiz;

if (!quiz || !Array.isArray(quiz.questions)) {
  return [
    {
      json: {
        valid: false,
        error: "РќРµРјР°С” quiz.questions РґР»СЏ Р·Р°РїРёСЃСѓ РІ Р‘Р”."
      }
    }
  ];
}

const options = $("Parse Generate Options").item.json;

return quiz.questions.map((question, index) => {
  const normalized = {
    categoryId: question.categoryId || quiz.categoryId || options.categoryId,
    levelId: String(question.levelId || quiz.levelId || options.levelId),
    num: question.num || index + 1,
    block: question.block || quiz.block || options.block,
    slug: question.slug || `quiz-question-${index + 1}`,
    data: question.data || question
  };

  return {
    json: {
      message: {
        text: JSON.stringify(normalized),
        chat: {
          id: options.telegramChatId
        },
        from: {
          id: options.telegramFromId
        },
        message_id: options.originalTelegramMessageId
      },
      generationOptions: {
        saveToDb: true,
        sendDocument: options.sendDocument,
        format: options.format,
        mode: "quiz",
        topic: options.topic,
        quizTitle: quiz.quizTitle || options.topic
      }
    }
  };
});
