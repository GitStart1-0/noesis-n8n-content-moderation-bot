// n8n Code node: Parse Callback
// Exported from workflows/noesis-telegram-content-moderation.workflow.json

const input = $input.first().json;
const callback = input.callback_query;

if (!callback) {
  return [
    {
      json: {
        validCallback: false,
        error: "Р¦Рµ РЅРµ callback query.",
        responseText: "вќЊ Р¦Рµ РЅРµ callback query.",
        debugInput: input
      }
    }
  ];
}

const data = String(callback.data || "").replace(/^=/, "");
const [action, questionId] = data.split("|");

const allowedActions = ["approve", "revise", "reject"];

const chatId =
  callback.message?.chat?.id ||
  callback.from?.id ||
  59229320;

if (!allowedActions.includes(action)) {
  return [
    {
      json: {
        validCallback: false,
        error: `РќРµРІС–РґРѕРјР° РґС–СЏ: ${action}`,
        callbackData: data,
        callbackQueryId: callback.id,
        telegramChatId: String(chatId),
        responseText: `вќЊ РќРµРІС–РґРѕРјР° РґС–СЏ: ${action}`
      }
    }
  ];
}

if (!questionId) {
  return [
    {
      json: {
        validCallback: false,
        error: "РќРµ РїРµСЂРµРґР°РЅРѕ questionId Сѓ callback data.",
        callbackData: data,
        callbackQueryId: callback.id,
        telegramChatId: String(chatId),
        responseText: "вќЊ РќРµ РїРµСЂРµРґР°РЅРѕ ID РїРёС‚Р°РЅРЅСЏ."
      }
    }
  ];
}

const actionLabels = {
  approve: "вњ… РћР±СЂР°РЅРѕ РґС–СЋ: Р·Р°РїРёСЃР°С‚Рё РїРёС‚Р°РЅРЅСЏ РІ Р‘Р”.",
  revise: "вњЏпёЏ РћР±СЂР°РЅРѕ РґС–СЋ: РїРµСЂРµСЂРѕР±РёС‚Рё РїРёС‚Р°РЅРЅСЏ.",
  reject: "вќЊ РћР±СЂР°РЅРѕ РґС–СЋ: РІС–РґС…РёР»РёС‚Рё РїРёС‚Р°РЅРЅСЏ."
};

return [
  {
    json: {
      validCallback: true,
      action,
      questionId,
      callbackQueryId: callback.id,
      telegramChatId: String(chatId),
      telegramMessageId: callback.message?.message_id,
      telegramFromId: callback.from?.id,
      callbackData: data,
      responseText: `${actionLabels[action]}\n\nID РїРёС‚Р°РЅРЅСЏ:\n${questionId}`
    }
  }
];
