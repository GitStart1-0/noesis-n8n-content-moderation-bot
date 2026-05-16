// n8n Code node: Prepare Revision Request
// Exported from workflows/noesis-telegram-content-moderation.workflow.json

const pending = $input.item.json;
const now = new Date().toISOString();

return [
  {
    json: {
      ...pending,
      status: "needs_revision",
      revisionRequestedAt: now,
      updatedAt: now,
      revisionInstructionMessage: [
        "вњЏпёЏ РџРёС‚Р°РЅРЅСЏ РїРѕР·РЅР°С‡РµРЅРѕ СЏРє С‚Р°РєРµ, С‰Рѕ РїРѕС‚СЂРµР±СѓС” РїРµСЂРµСЂРѕР±РєРё.",
        "",
        `ID: ${pending.questionId}`,
        "",
        "РќР°РїРёС€Рё РІС–РґРїРѕРІС–РґРґСЋ РЅР° С†Рµ РїРѕРІС–РґРѕРјР»РµРЅРЅСЏ, С‰Рѕ СЃР°РјРµ РїРѕС‚СЂС–Р±РЅРѕ РІРёРїСЂР°РІРёС‚Рё.",
        "",
        "РџСЂРёРєР»Р°РґРё:",
        "- Р·СЂРѕР±Рё РІР°СЂС–Р°РЅС‚Рё РјРµРЅС€ РѕС‡РµРІРёРґРЅРёРјРё",
        "- РґРѕРґР°Р№ С‚РѕС‡РЅС–С€Рµ РїРѕСЏСЃРЅРµРЅРЅСЏ",
        "- Р·СЂРѕР±Рё РїРёС‚Р°РЅРЅСЏ СЃРєР»Р°РґРЅС–С€РёРј",
        "- Р·Р°РјС–РЅРё С‚РµРјСѓ Р°Р±Рѕ С„РѕСЂРјСѓР»СЋРІР°РЅРЅСЏ"
      ].join("\n")
    }
  }
];
