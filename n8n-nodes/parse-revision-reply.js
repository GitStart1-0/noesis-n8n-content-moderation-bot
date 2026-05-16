// n8n Code node: Parse Revision Reply
// Exported from workflows/noesis-telegram-content-moderation.workflow.json

const input = $input.first().json;
const message = input.message || {};

const revisionComment = String(message.text || "").trim();

const replyText = String(
  message.reply_to_message?.text ||
  message.reply_to_message?.caption ||
  ""
).trim();

const telegramChatId = message.chat?.id;
const telegramFromId = message.from?.id;
const replyMessageId = message.message_id;
const repliedToMessageId = message.reply_to_message?.message_id;

function extractQuestionId(text) {
  const source = String(text || "")
    .replace(/[вЂ“вЂ”]/g, "-")
    .replace(/\u00A0/g, " ");

  const lines = source.split(/\r?\n/).map(line => line.trim());

  for (const line of lines) {
    const match = line.match(/^ID:\s*(.+)$/i);
    if (match && match[1]) {
      return match[1].trim().split(/\s+/)[0];
    }
  }

  const fallback = source.match(/ua--[A-Za-z0-9_-]+/);
  if (fallback) {
    return fallback[0].trim();
  }

  return "";
}

if (!message.reply_to_message) {
  return [
    {
      json: {
        ok: false,
        error: "РџРѕРІС–РґРѕРјР»РµРЅРЅСЏ РЅРµ С” РІС–РґРїРѕРІС–РґРґСЋ РЅР° Р·Р°РїРёС‚ РїРµСЂРµСЂРѕР±РєРё. РќР°С‚РёСЃРЅРё Reply СЃР°РјРµ РЅР° РїРѕРІС–РґРѕРјР»РµРЅРЅСЏ Р±РѕС‚Р° Р· ID РїРёС‚Р°РЅРЅСЏ.",
        telegramChatId,
        debugReplyText: replyText,
        debugInput: input
      }
    }
  ];
}

const questionId = extractQuestionId(replyText);

if (!questionId) {
  return [
    {
      json: {
        ok: false,
        error: "РќРµ РІРґР°Р»РѕСЃСЏ Р·РЅР°Р№С‚Рё ID РїРёС‚Р°РЅРЅСЏ РІ РїРѕРІС–РґРѕРјР»РµРЅРЅС–, РЅР° СЏРєРµ РґР°РЅР° РІС–РґРїРѕРІС–РґСЊ.",
        telegramChatId,
        debugReplyText: replyText,
        debugInput: input
      }
    }
  ];
}

if (!revisionComment) {
  return [
    {
      json: {
        ok: false,
        error: "РљРѕРјРµРЅС‚Р°СЂ РґР»СЏ РїРµСЂРµСЂРѕР±РєРё РїРѕСЂРѕР¶РЅС–Р№.",
        telegramChatId,
        questionId,
        debugReplyText: replyText
      }
    }
  ];
}

return [
  {
    json: {
      ok: true,
      questionId,
      revisionComment,
      telegramChatId,
      telegramFromId,
      revisionReplyMessageId: replyMessageId,
      repliedToMessageId,
      receivedAt: new Date().toISOString(),
      debugReplyText: replyText
    }
  }
];
