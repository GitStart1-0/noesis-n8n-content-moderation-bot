// n8n Code node: Attach Review Result
// Exported from workflows/noesis-telegram-content-moderation.workflow.json

const reviewResponse = $input.item.json;

const aiText =
  reviewResponse.output_text ||
  reviewResponse.output?.[0]?.content?.[0]?.text ||
  reviewResponse.output?.[0]?.content?.find?.(c => c.type === "output_text")?.text ||
  reviewResponse.text ||
  "";

let review;

try {
  const cleaned = String(aiText)
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  review = JSON.parse(cleaned);
} catch (error) {
  review = {
    approved: false,
    confidence: 0,
    verdict: "revise",
    issues: ["РќРµ РІРґР°Р»РѕСЃСЏ СЂРѕР·С–Р±СЂР°С‚Рё AI review СЏРє JSON."],
    recommendations: ["РџРµСЂРµРІС–СЂРёС‚Рё РїРёС‚Р°РЅРЅСЏ РІСЂСѓС‡РЅСѓ."]
  };
}

const original = $("Prepare Review Request").item.json;

return [
  {
    json: {
      ...original,
      aiReview: review,
      message: {
        ...original.message,
        text: JSON.stringify(original.generatedJson)
      }
    }
  }
];
