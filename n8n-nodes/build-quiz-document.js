// n8n Code node: Build Quiz Document
// Exported from workflows/noesis-telegram-content-moderation.workflow.json

function safeFileName(value) {
  return String(value || "noesis_quiz")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);
}

const input = $input.first().json;
const raw = input.message?.text || "";

let quiz;

try {
  quiz = JSON.parse(raw);
} catch (error) {
  return [
    {
      json: {
        ok: false,
        error: "AI РїРѕРІРµСЂРЅСѓРІ РЅРµРІР°Р»С–РґРЅРёР№ JSON РґР»СЏ РјС–РЅС–-РІС–РєС‚РѕСЂРёРЅРё.",
        raw
      }
    }
  ];
}

const questions = Array.isArray(quiz.questions) ? quiz.questions : [];

let markdown = `# ${quiz.quizTitle || "NoesisQuiz: РјС–РЅС–-РІС–РєС‚РѕСЂРёРЅР°"}\n\n`;
markdown += `**РўРµРјР°:** ${quiz.topic || $("Parse Generate Options").item.json.topic}\n\n`;
markdown += `**РљР°С‚РµРіРѕСЂС–СЏ:** ${quiz.categoryId || $("Parse Generate Options").item.json.categoryId}\n\n`;
markdown += `**Р С–РІРµРЅСЊ:** ${quiz.levelId || $("Parse Generate Options").item.json.levelId}\n\n`;
markdown += `**Р‘Р»РѕРє:** ${quiz.block || $("Parse Generate Options").item.json.block}\n\n`;
markdown += `**РљС–Р»СЊРєС–СЃС‚СЊ РїРёС‚Р°РЅСЊ:** ${questions.length}\n\n`;
markdown += `---\n\n`;

const options = $("Parse Generate Options").item.json;

if (options.countWasLimited) {
  markdown += `> вљ пёЏ Р—Р°РїРёС‚Р°РЅСѓ РєС–Р»СЊРєС–СЃС‚СЊ РїРёС‚Р°РЅСЊ Р·РјРµРЅС€РµРЅРѕ Р· ${options.requestedCount} РґРѕ ${options.maxQuizCount}, С‰РѕР± СѓРЅРёРєРЅСѓС‚Рё РЅР°РґРјС–СЂРЅРѕС— РіРµРЅРµСЂР°С†С–С—.\n\n`;
}

questions.forEach((q, index) => {
  const data = q.data || q;

  markdown += `## ${index + 1}. ${data.question || "РџРёС‚Р°РЅРЅСЏ Р±РµР· С‚РµРєСЃС‚Сѓ"}\n\n`;
  markdown += `**РўРёРї:** ${data.type || "UNKNOWN"}\n\n`;

  if (Array.isArray(data.answers)) {
    markdown += `**Р’Р°СЂС–Р°РЅС‚Рё:**\n\n`;
    data.answers.forEach((answer, i) => {
      const isCorrect = Array.isArray(data.correctAnswerIndices) && data.correctAnswerIndices.includes(i);
      markdown += `${i + 1}. ${answer}${isCorrect ? " вњ…" : ""}\n`;
    });
    markdown += `\n`;
  }

  if (data.explanation) {
    markdown += `**РџРѕСЏСЃРЅРµРЅРЅСЏ:** ${data.explanation}\n\n`;
  }

  if (Array.isArray(data.topics)) {
    markdown += `**РўРµРјРё:** ${data.topics.join(", ")}\n\n`;
  }

  markdown += `---\n\n`;
});

const title = quiz.quizTitle || $("Parse Generate Options").item.json.topic || "noesis_quiz";
const fileName = `${safeFileName(title)}.md`;

return [
  {
    json: {
      ok: true,
      mode: "quiz",
      quizTitle: quiz.quizTitle || title,
      fileName,
      documentText: markdown,
      telegramChatId: $("Parse Generate Options").item.json.telegramChatId,
      quiz
    },
    binary: {
      data: {
        data: Buffer.from(markdown, "utf8").toString("base64"),
        mimeType: "text/markdown",
        fileName
      }
    }
  }
];
