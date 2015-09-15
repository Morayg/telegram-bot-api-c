```js
npm install telegram-bot-api-c
git clone https://github.com/Daeren/telegram-bot-api-c.git
```


```js
var rBot = require("telegram-bot-api-c");

//-----------------------------------------------------

var objBotApi =  rBot(process.env.TELEGRAM_BOT_TOKEN).api;

var file    = __dirname + "/MiElPotato.jpg",
    data    = () => ({"chat_id": -34042985, "text": Date.now(), "parse_mode": "markdown"});

objBotApi.sendMessage(data(), function() {
    objBotApi
        .sendMessage(data())
        
        .then(data)
        .then(x => api.sendMessage(x))

        .then(data)
        .then(x => {
            x.photo = file;
            api.sendPhoto(x);
        });
});
```

[Telegram Bot API][2]

* Stream: +
* Server: +
* Promise: +
* ES6: +
* Analytics: +


#### Polling 

```js
var api = objBot.api;

api
    .setWebhook()
    .then(() => api.getUpdates())
    .then(JSON.parse)
    .then(console.log, console.error);
```


#### Analytics 

Used [Botan SDK][3]

```js
objBot
    .server(objSrvOptions, cbMsg)
    .analytics("apiKey", "appName")
    .command("start", cbCmdStart);
```


#### Server

```js
var rBot = require("telegram-bot-api-c");

//-----------------------------------------------------

var objBotFather    = rBot();
var objSrvOptions   = {
    // For Self-signed certificate, you need to upload your public key certificate
    // "selfSigned":  "fullPath/stream/string-key",

    "certDir":  "/www/site",

    "key":       "/3_site.xx.key",
    "cert":      "/2_site.xx.crt",
    "ca":       [
        "/AddTrustExternalCARoot.crt",
        "/COMODORSAAddTrustCA.crt",
        "/COMODORSADomainValidationSecureServerCA.crt"
    ],

    "http":     false, //_ nginx + nodejs = <3
    "host":     "site.xx"
};

//------------------]>

var objMyBot    = rBot(process.env.TG_BOT_TOKEN_MY),
    objOtherBot = rBot(process.env.TG_BOT_TOKEN_OTHER);

var objSrv = objBotFather.server(objSrvOptions);

objSrv
    .bot(objMyBot, "/MyBot") // <-- Auto-Webhook
    .analytics("apiKey", "appNameMyBot")
    
    .command("start", cbCmdStart)
    .command("stop", cbCmdStop);

objSrv
    .bot(objOtherBot, "/OtherBot", cbOtherBot)
    .analytics("apiKey", "appNameOtherBot");
    
//------------------]>

function cbOtherBot(data) {
    var msg         = data.message;

    // this.id = msgChat.id; <-- Default: chat_id in message

    this.api
        .getMe()
        .then(() => {
            this.data.chatAction = "typing";
            return this.send();
        })
        .then(() => {
            this.data.message = "Use: /start";
            return this.send();
        })
        .then(() => {
            this.data.photo = __dirname + "/MiElPotato.jpg";
            return this.send();
        })
        .then(() => {
            // this.mid = msg.message_id; <-- Default: message_id in message
            // this.from = msgChat.id; <-- Default: chat_id in message
            
            this.to = msg.text;
            return this.forward();
        })
        .then(() => {
            this.data.message = ">_>";
            return this.send();
        })
        .then(JSON.parse)
        .then(console.log, console.error);
}

//--------------)>

function cbCmdStart(data, params) {
    this.data.message = "Cmd: " + params.name + params.text;
    this.send();
}

function cbCmdStop(data, params) {
    this.data.message = params;
    this.send();
}
```


#### mServer

```js
var objBot = new rBot(process.env.TELEGRAM_BOT_TOKEN);

objBot.api
    .setWebhook({"url": "site.xx/myBot"})
    .then(JSON.parse)
    .then(response => {
        if(!response.ok)
            throw new Error("Oops...problems with webhook...");

        objBot
            .server(objSrvOptions, cbMsg)
            .command("start", cbCmdStart);
    }, console.error);
```


#### Instance 

| Attribute         | Type           | Note                              |
|-------------------|----------------|-----------------------------------|
|                   | -              |                                   |
| api               | Object         | See [Telegram Bot API][2]         |


| Method            | Arguments                                                             | Return                            |
|-------------------|-----------------------------------------------------------------------|-----------------------------------|
|                   | -                                                                     |                                   |
| setToken          | token                                                                 | this                              |
|                   | -                                                                     |                                   |
| call              | method, data[, callback(error, buffer, response)]                     |                                   |
| callJson          | method, data[, callback(error, json, response)]                       |                                   |
|                   | -                                                                     |                                   |
| send              | id, data[, callback(error, buffer, response)]                         | promise or undefined              |
|                   | -                                                                     |                                   |
| createServer      | [options][, callback(json, request)]                                  | ~                                 |


#### Methods: send

| Name          | Type                                  | Note                                      |
|---------------|---------------------------------------|-------------------------------------------|
|               | -                                     |                                           |
| message       | string, json                          |                                           |
| photo         | string, stream                        | Ext: jpg, jpeg, gif, tif, png, bmp        |
| audio         | string, stream                        | Ext: mp3                                  |
| document      | string, stream                        |                                           |
| sticker       | string, stream                        | Ext: webp, jpg, jpeg, gif, tif, png, bmp  |
| video         | string, stream                        | Ext: mp4                                  |
| voice         | string, stream                        | Ext: ogg                                  |
| location      | string, json                          |                                           |
| chatAction    | string                                |                                           |

#### Methods: server

| Name          | Arguments                             | Note                                      |
|---------------|---------------------------------------|-------------------------------------------|
|               | -                                     |                                           |
| bot           | bot, path, callback(json, request)    |                                           |
| analytics     | apiKey[, appName="Telegram Bot"]      |                                           |
| command       | cmd, callback(data, params, request)  |                                           |


## License

MIT

----------------------------------
[@ Daeren Torn][1]


[1]: http://666.io
[2]: https://core.telegram.org/bots/api
[3]: https://github.com/botanio/sdk#js