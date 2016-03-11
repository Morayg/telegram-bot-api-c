//-----------------------------------------------------
//
// Author: Daeren
// Site: 666.io
//
//-----------------------------------------------------

/*jshint expr: true*/
/*global describe, it*/

"use strict";

//-----------------------------------------------------

const rChai     = require("chai");

const expect    = rChai.expect;

const rBot      = require("./../index");

//-----------------------------------------------------

const token         = process.env.TELEGRAM_BOT_TOKEN,
      chatId        = process.env.TELEGRAM_CHAT_ID,
      msgId         = process.env.TELEGRAM_MSG_ID;

const objBot        = rBot(token);

const inputSrvMessage = {
    "update_id": 13,

    "message": {
        "message_id": msgId,

        "from": {
            "id": chatId,
            "first_name": "D",
            "username": ""
        },

        "chat": {
            "id": chatId,
            "first_name": "D",
            "username": "",
            "type": "private"
        },

        "date": Date.now(),
        "text": "Hello"
    }
};

const inputSrvMessageCmd = {
    "update_id": 13,

    "message": {
        "message_id": msgId,

        "from": {
            "id": chatId,
            "first_name": "D",
            "username": ""
        },

        "chat": {
            "id": chatId,
            "first_name": "D",
            "username": "",
            "type": "private"
        },

        "date": Date.now(),
        "text": "/ hello"
    }
};

//-----------------------------------------------------

expect(token).to.exist;
expect(chatId).to.exist;
expect(msgId).to.exist;

//-----------------------------------------------------

describe("srv.virtual", function() {

    this.timeout(1000 * 10);

    //-----------------]>

    it("Base", function() {
        expect(objBot.virtual).to.be.a("function");
    });

    //-----------------]>

    it("Instance", function() {
        let servers = [
            objBot.virtual(),
            objBot.virtual(function() { })
        ];

        servers.forEach(function(srv) {
            expect(srv).to.be.an("object").and.not.equal(null);

            expect(srv).to.have.property("input").that.is.a("function");
            expect(srv).to.have.property("middleware").that.is.a("function");

            expect(srv).to.have.property("logger").that.is.a("function");
            expect(srv).to.have.property("use").that.is.a("function");
            expect(srv).to.have.property("on").that.is.a("function");
            expect(srv).to.have.property("off").that.is.a("function");
        })
    });

    //----------]>

    it("Instance (base [function])", function(done) {
        let server = objBot.virtual(function(bot) {
            tCheckBaseBotFields(bot);
            done();
        });

        server.logger(cbLogger);

        server.input(null, inputSrvMessage);
    });

    it("Instance (base [function] | use)", function(done) {
        let server = objBot.virtual(function* (bot) {
            const result = yield proc();

            expect(result).to.be.a("number").and.equal(13);
            expect(bot).to.have.property("xMeta").that.is.an("number").and.equal(5);

            tCheckBaseBotFields(bot);
            done();
        });

        server.logger(cbLogger);

        //------]>

        server.use(function(type, bot) {
            expect(type).to.be.a("string").and.equal("text");

            bot.xMeta = 1;

            tCheckBaseBotFields(bot);
        });

        server.use(function(type, bot, next) {
            expect(type).to.be.a("string").and.equal("text");
            expect(next).to.be.a("function");
            expect(bot).to.have.property("xMeta").that.is.an("number").and.equal(1);

            bot.xMeta++;

            tCheckBaseBotFields(bot);
            next();
        });

        //------]>

        server.use("text", function(bot) {
            tCheckBaseBotFields(bot);
        });

        server.use("text", function(bot, next) {
            expect(next).to.be.a("function");
            expect(bot).to.have.property("xMeta").that.is.an("number").and.equal(2);

            bot.xMeta++;

            tCheckBaseBotFields(bot);
            next();
        });

        //------]>

        server.use(function* (type, bot) {
            const result = yield proc();

            expect(result).to.be.a("number").and.equal(13);
            expect(type).to.be.a("string").and.equal("text");
            expect(bot).to.have.property("xMeta").that.is.an("number").and.equal(3);

            bot.xMeta++;

            tCheckBaseBotFields(bot);
        });

        server.use("text", function* (bot) {
            const result = yield proc();

            expect(result).to.be.a("number").and.equal(13);
            expect(bot).to.have.property("xMeta").that.is.an("number").and.equal(4);

            bot.xMeta++;

            tCheckBaseBotFields(bot);
        });

        //------]>

        server.input(null, inputSrvMessage);

        //------]>

        function proc() {
            return new Promise(x => x(13));
        }
    });

    //----------]>

    it("Instance (event: text)", function(done) {
        let server = objBot.virtual(function() {
            throw new Error("The message passed through the event | #1");
        });

        server.logger(cbLogger);

        server.on("*", function() {
            throw new Error("The message passed through the event | #2");
        });

        server.on("/", function() {
            throw new Error("The message passed through the event | #3");
        });

        server.on("text", function(bot) {
            tCheckBaseBotFields(bot);
            done();
        });

        server.input(null, inputSrvMessage);
    });

    it("Instance (event: text | mix)", function(done) {
        let server = objBot.virtual(function() {
            throw new Error("The message passed through the event | #1");
        });

        server.logger(cbLogger);

        server.on("*", function() {
            throw new Error("The message passed through the event | #2");
        });

        server.on("/", function() {
            throw new Error("The message passed through the event | #3");
        });

        server.on("photo text audio", function(bot) {
            tCheckBaseBotFields(bot);
            done();
        });

        server.input(null, inputSrvMessage);
    });

    it("Instance (event: regex)", function(done) {
        let server = objBot.virtual(function() {
            throw new Error("The message passed through the event | #1");
        });

        server.logger(cbLogger);

        server.on("*", function() {
            throw new Error("The message passed through the event | #2");
        });

        server.on("/", function() {
            throw new Error("The message passed through the event | #3");
        });

        server.on("text", function() {
            throw new Error("The message passed through the event | #4");
        });

        server.on(/(\w+)/, function(bot, params) {
            expect(params).to.be.a("array");
            expect(params[0]).to.be.a("string").and.equal(bot.message.text);
            expect(params[1]).to.be.a("string").and.equal(bot.message.text);

            tCheckBaseBotFields(bot);
            done();
        });

        server.input(null, inputSrvMessage);
    });

    it("Instance (event: regex | map)", function(done) {
        let server = objBot.virtual(function() {
            throw new Error("The message passed through the event | #1");
        });

        server.logger(cbLogger);

        server.on("*", function() {
            throw new Error("The message passed through the event | #2");
        });

        server.on("/", function() {
            throw new Error("The message passed through the event | #3");
        });

        server.on("text", function() {
            throw new Error("The message passed through the event | #4");
        });

        server.on(/(\w+)/, ["myText"], function(bot, params) {
            expect(params).to.be.an("object");
            expect(params.myText).to.be.a("string").and.equal(bot.message.text);

            tCheckBaseBotFields(bot);
            done();
        });

        server.input(null, inputSrvMessage);
    });

    it("Instance (event: text | off)", function(done) {
        let server = objBot.virtual(function() {
            throw new Error("The message passed through the event | #1");
        });

        server.logger(cbLogger);

        server.on("*", function(bot) {
            tCheckBaseBotFields(bot);
            done();
        });

        server.on("/", function() {
            throw new Error("The message passed through the event | #2");
        });

        server.on("text", onText);
        server.off("text", onText);

        server.input(null, inputSrvMessage);

        //------]>

        function onText() {
            throw new Error("Call-off events");
        }
    });

    it("Instance (event: text | goto | sync)", function(done) {
        let server = objBot.virtual(function() {
            throw new Error("The message passed through the event | #1");
        });

        server.use(function(type, bot) {
            return type === "text" && bot.message.text === "Hello" ? "goto" : "";
        });

        server.logger(cbLogger);

        server.on("*", function() {
            throw new Error("The message passed through the event | #2");
        });

        server.on("/", function() {
            throw new Error("The message passed through the event | #3");
        });

        server.on("text", onText);
        server.on("text:goto", onTextGoto);

        //------]>

        server.input(null, inputSrvMessage);

        //------]>

        function onText() {
            throw new Error("The message passed through the event | #4");
        }

        function onTextGoto(bot) {
            tCheckBaseBotFields(bot);
            done();
        }
    });

    it("Instance (event: text | goto | async)", function(done) {
        let server = objBot.virtual(function() {
            throw new Error("The message passed through the event | #1");
        });

        server.use(function(type, bot, next) {
            next(type === "text" && bot.message.text === "Hello" ? "goto" : "");
        });

        server.logger(cbLogger);

        server.on("*", function() {
            throw new Error("The message passed through the event | #2");
        });

        server.on("/", function() {
            throw new Error("The message passed through the event | #3");
        });

        server.on("text", onText);
        server.on("text:goto", onTextGoto);

        //------]>

        server.input(null, inputSrvMessage);

        //------]>

        function onText() {
            throw new Error("The message passed through the event | #4");
        }

        function onTextGoto(bot) {
            tCheckBaseBotFields(bot);
            done();
        }
    });

    it("Instance (event: cmd)", function(done) {
        let server = objBot.virtual(function() {
            throw new Error("The message passed through the event | #1");
        });

        server.on("*", function() {
            throw new Error("The message passed through the event | #2");
        });

        server.on("/", function(bot, params) {
            tCheckBaseBotFields(bot);
            tCheckBaseCmdFields(params);

            done();
        });

        server.on("text", function() {
            throw new Error("The message passed through the event | #3");
        });

        //------]>

        server.input(null, inputSrvMessageCmd);
    });

    it("Instance (event: cmd | goto)", function(done) {
        let server = objBot.virtual(function() {
            throw new Error("The message passed through the event | #1");
        });

        server.use(function(type, bot) {
            return type === "text" && bot.message.text === "/ hello" ? "goto" : "";
        });

        server.on("*", function() {
            throw new Error("The message passed through the event | #2");
        });

        server.on("/:goto", function(bot, params) {
            tCheckBaseBotFields(bot);
            tCheckBaseCmdFields(params);

            done();
        });

        server.on("text", function() {
            throw new Error("The message passed through the event | #3");
        });

        server.on("text:goto", function() {
            throw new Error("The message passed through the event | #4");
        });

        //------]>

        server.input(null, inputSrvMessageCmd);
    });

});

//-------------]>

function cbLogger(error, data) {
    if(error) {
        expect(error).to.be.an.instanceof(Error);
    }
    else {
        expect(error).to.be.null;
        expect(data).to.be.an("object");

        expect(data).to.have.property("update_id").that.is.an("number");
        expect(data).to.have.property("message").that.is.an("object");
    }
}

function tCheckBaseBotFields(bot) {
    expect(bot).to.be.an("object").and.not.equal(null);
    expect(bot).to.have.property("message").that.is.an("object").and.not.equal(null);

    //----------]>

    const msg = bot.message;

    expect(msg).to.have.property("message_id");
    expect(msg).to.have.property("from").that.is.an("object").and.not.equal(null);
    expect(msg).to.have.property("chat").that.is.an("object").and.not.equal(null);
    expect(msg).to.have.property("date");

    expect(bot).to.have.property("isGroup").that.is.an("boolean");
    expect(bot).to.have.property("isReply").that.is.an("boolean");

    expect(bot).to.have.property("cid").that.equal(msg.chat.id);
    expect(bot).to.have.property("mid").that.equal(msg.message_id);
    expect(bot).to.have.property("from").that.equal(msg.chat.id);

    //----------]>

    expect(bot).to.have.property("render").that.is.a("function");
    expect(bot).to.have.property("send").that.is.a("function");
    expect(bot).to.have.property("forward").that.is.a("function");
    expect(bot).to.have.property("answer").that.is.a("function");

    //----------]>

    expect(bot.api).to.deep.equal(objBot.api);

    //----------]>

    [
        "sendMessage",
        "sendPhoto",
        "sendAudio",
        "sendDocument",
        "sendSticker",
        "sendVideo",
        "sendVoice",
        "sendLocation",
        "sendChatAction"
    ]
        .forEach(function(e) {
            expect(bot[e]).to.be.a("function");
        });
}

function tCheckBaseCmdFields(params, isPrivate) {
    expect(params).to.be.a("object").and.not.equal(null);

    expect(params).to.have.property("type").that.is.equal(isPrivate ? "private" : "common");
    expect(params).to.have.property("name").that.is.equal("");
    expect(params).to.have.property("text").that.is.equal("hello");
    expect(params).to.have.property("cmd").that.is.equal("/");
}