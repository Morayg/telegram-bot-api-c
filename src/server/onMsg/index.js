//-----------------------------------------------------
//
// Author: Daeren
// Site: 666.io
//
//-----------------------------------------------------

"use strict";

//-----------------------------------------------------

const rUtil                         = require("./../../util");

const onIncomingMessage             = require("./onIncomingMessage"),
      onIncomingInlineQuery         = require("./onIncomingInlineQuery"),
      onIncomingCallbackQuery       = require("./onIncomingCallbackQuery"),
      onIncomingChosenInlineResult  = require("./onIncomingChosenInlineResult");

//-----------------------------------------------------

const gIncomeEv = [
    ["inline_query",            "inlineQuery",          onIncomingInlineQuery],
    ["message",                 "message",              onIncomingMessage],
    ["edited_message",          "editedMessage",        onIncomingMessage],
    ["callback_query",          "callbackQuery",        onIncomingCallbackQuery],
    ["chosen_inline_result",    "chosenInlineResult",   onIncomingChosenInlineResult]
];

//-----------------------------------------------------

module.exports = main;

//-----------------------------------------------------

function main(error, srvBot, data) {
    if(error) {
        onError(error);
    }
    else if(data && typeof(data) === "object") {
        for(let ev, input, i = 0, len = gIncomeEv.length; i < len; i++) {
            ev = gIncomeEv[i];
            input = data[ev[0]];

            if(input && typeof(input) === "object") {
                ev[2](srvBot, ev[1], input, onEnd);
                break;
            }
        }
    }

    //--------]>

    function onEnd(error, reqCtx, gotoState) {
        if(error) {
            onError(error);
        }
        else if(reqCtx) {
            let onMsg = srvBot.onMsg;

            if(onMsg) {
                try {
                    onMsg = onMsg(reqCtx, gotoState);
                } catch(e) {
                    onError(e);
                }

                rUtil.executeGenerator(onMsg, onError);
            }
        }
    }

    function onError(error) {
        if(error) {
            let cbCatch = srvBot.cbCatch;

            if(cbCatch) {
                cbCatch = cbCatch(error);
                rUtil.executeGenerator(cbCatch);
            }
            else {
                throw error;
            }
        }
    }
}