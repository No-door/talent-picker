const SlackAppSocket = require('../services/SlackAppSocket.service');
const OpenAIService = require('../services/OpenAI.service');
require('dotenv').config()



console.log(process.env.SLACK_TOKEN);
const BOT_TAG_NAME = '<@U05LFJT7RUZ>';

const app = SlackAppSocket.getApp();
const arrayThreadSentContext = [];
app.message(async ({message, say}) => {
    if (message.text.includes(BOT_TAG_NAME)) {
        const openAIService = new OpenAIService();
        const messages = await SlackAppSocket.getMessagesInThread(message);
        let promptMessage = openAIService.messagesToInput(messages);

        const result = await openAIService.createChatCompletion(promptMessage);
        if(result === null) {
            await say({
                text: `Hi, <@${message.user}>  I don\'t understand what you mean, please try tag me again with more detail information.`,
                thread_ts: message.ts
            })
        } else {
            console.log(result);
        }
    }
});

(async () => {
    await app.start();
    console.log('⚡️ Bolt app is running!');
})();


exports.bot = app;