const {SocketModeClient, LogLevel} = require('@slack/socket-mode');
const {WebClient} = require('@slack/web-api');
var SlackBot = require('slackbots');
const SlackAppSocket = require('../services/SlackAppSocket.service');
require('dotenv').config()
const EmployeeRepository = require('../repositories/employee.repository');
const {App} = require("@slack/bolt");
console.log(process.env.SLACK_TOKEN);
const BOT_TAG_NAME = '<@U05LFJT7RUZ>';

const app = SlackAppSocket.getApp();
app.message(async ({message, say}) => {
    if (message.text.includes(BOT_TAG_NAME)) {

        const messages = await SlackAppSocket.getMessagesInThread(message);
        console.log(messages)


    }
});

(async () => {
    await app.start();
    console.log('⚡️ Bolt app is running!');
})();


exports.bot = app;