// n8n Code node: Build Question Document
// Exported from workflows/noesis-telegram-content-moderation.workflow.json

function safeFileName(value) {
  return String(value || "noesis_question")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);
}

const input = $input.first().json;
const data = input.documentData;

if (!data) {
  return [
    {
      json: {
        ok: false,
        error: "РќРµРјР°С” documentData РґР»СЏ С„РѕСЂРјСѓРІР°РЅРЅСЏ РґРѕРєСѓРјРµРЅС‚Р°."
      }
    }
  ];
}

let markdown = "";

markdown += `# NoesisQuiz: РїРёС‚Р°РЅРЅСЏ\n\n`;
markdown += `**РўРµРјР° РіРµРЅРµСЂР°С†С–С—:** ${input.generationOptions?.topic || "РЅРµ РІРєР°Р·Р°РЅРѕ"}\n\n`;
markdown += `**РљР°С‚РµРіРѕСЂС–СЏ:** ${input.categoryId}\n\n`;
markdown += `**Р С–РІРµРЅСЊ:** ${input.levelId}\n\n`;
markdown += `**Р‘Р»РѕРє:** ${data.block || input.block || "A"}\n\n`;
markdown += `**РўРёРї:** ${data.type}\n\n`;
markdown += `**ID:** ${input.questionId}\n\n`;

markdown += `## РџРёС‚Р°РЅРЅСЏ\n\n`;
markdown += `${data.question || data.text || "Р‘РµР· С‚РµРєСЃС‚Сѓ РїРёС‚Р°РЅРЅСЏ"}\n\n`;

if (Array.isArray(data.answers)) {
  markdown += `## Р’Р°СЂС–Р°РЅС‚Рё РІС–РґРїРѕРІС–РґС–\n\n`;

  data.answers.forEach((answer, index) => {
    const isCorrect =
      Array.isArray(data.correctAnswerIndices) &&
      data.correctAnswerIndices.includes(index);

    markdown += `${index + 1}. ${answer}${isCorrect ? " вњ…" : ""}\n`;
  });

  markdown += `\n`;
}

if (typeof data.correctAnswer === "boolean") {
  markdown += `## РџСЂР°РІРёР»СЊРЅР° РІС–РґРїРѕРІС–РґСЊ\n\n`;
  markdown += `${data.correctAnswer ? "РўР°Рє" : "РќС–"}\n\n`;
}

if (Array.isArray(data.correctAnswers)) {
  markdown += `## РџСЂР°РІРёР»СЊРЅС– РІС–РґРїРѕРІС–РґС–\n\n`;
  markdown += `${data.correctAnswers.join(", ")}\n\n`;
}

if (data.explanation) {
  markdown += `## РџРѕСЏСЃРЅРµРЅРЅСЏ\n\n`;
  markdown += `${data.explanation}\n\n`;
}

if (Array.isArray(data.topics)) {
  markdown += `## РўРµРјРё\n\n`;
  markdown += `${data.topics.join(", ")}\n\n`;
}

if (Array.isArray(data.scientificDisciplines)) {
  markdown += `## Р”РёСЃС†РёРїР»С–РЅРё\n\n`;
  markdown += `${data.scientificDisciplines.join(", ")}\n\n`;
}

if (Array.isArray(data.recommendedLiterature) && data.recommendedLiterature.length > 0) {
  markdown += `## Р РµРєРѕРјРµРЅРґРѕРІР°РЅР° Р»С–С‚РµСЂР°С‚СѓСЂР°\n\n`;

  data.recommendedLiterature.forEach((item) => {
    markdown += `- ${item.name || "Р”Р¶РµСЂРµР»Рѕ"}${item.link ? ` - ${item.link}` : ""}\n`;
  });

  markdown += `\n`;
}

markdown += `---\n\n`;
markdown += `JSON ID: \`${input.questionId}\`\n`;
markdown += `РЎС‚РІРѕСЂРµРЅРѕ: ${new Date().toISOString()}\n`;

const fileName = `${safeFileName(input.generationOptions?.topic || data.slug || input.questionId)}.md`;

return [
  {
    json: {
      ...input,
      ok: true,
      fileName,
      documentText: markdown
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
