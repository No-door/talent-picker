const {App} = require("@slack/bolt");
require('dotenv').config();


const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_TOKEN,
    socketMode: true, // add this
    appToken: process.env.SLACK_APP_TOKEN,
    port: 9999
});

class SlackAppSocketService {
    constructor() {
        this.app = app;
    }

    getApp() {
        return this.app;
    }

    async getMessagesInThread(message) {
        const parentMessage = await app.client.conversations.replies({
            token: process.env.SLACK_TOKEN,
            channel: message.channel,
            ts: message.ts
        });
        const parentThread = parentMessage.messages[0]?.thread_ts;
        if(!parentThread) return [message];
        const thread = await app.client.conversations.replies({
            token: process.env.SLACK_TOKEN,
            channel: message.channel,
            ts: parentThread
        });

        return thread.messages;
    }

    async isMessageInThread(message) {
        const parentMessage = await app.client.conversations.replies({
            token: process.env.SLACK_TOKEN,
            channel: message.channel,
            ts: message.ts
        });
        const parentThread = parentMessage.messages[0]?.thread_ts;

        return parentThread !== undefined;
    }
}

module.exports = new SlackAppSocketService();
