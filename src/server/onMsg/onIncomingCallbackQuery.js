//-----------------------------------------------------
//
// Author: Daeren
// Site: 666.io
//
//-----------------------------------------------------

"use strict";

//-----------------------------------------------------

const rRunAction = require("./runAction");

//-----------------------------------------------------

module.exports = main;

//-----------------------------------------------------

function main(ctx, plugins, events, updateType, eventType, input, callback) {
    const message       = input.message;
    const msgChat       = message && message.chat;

    const isGroup       = !!(msgChat && (msgChat.type === "group" || msgChat.type === "supergroup")),
          isReply       = !!(message && message.reply_to_message);

    //------------]>

    ctx.cqid = input.id;
    ctx.qid = input.inline_message_id;
    ctx.cid = msgChat && msgChat.id;
    ctx.mid = message && message.message_id;

    ctx.isGroup = isGroup;
    ctx.isReply = isReply;

    //------------]>

    rRunAction(ctx.updateSubType, eventType, ctx.eventSubType, plugins, events, input, ctx, callback);
}