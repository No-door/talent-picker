const SlackAppSocket = require('../services/SlackAppSocket.service');
const OpenAIService = require('../services/OpenAI.service');
require('dotenv').config()



console.log(process.env.SLACK_TOKEN);
const BOT_TAG_NAME = '<@U05LFJT7RUZ>';

const app = SlackAppSocket.getApp();
const arrayThreadSentContext = [];
app.message(async ({message, say}) => {
    if (message.text.includes(BOT_TAG_NAME)) {
        const thread = message.thread_ts;
        const isSentContext = arrayThreadSentContext.includes(thread);

        const openAIService = new OpenAIService();
        const messages = await SlackAppSocket.getMessagesInThread(message);
        let promptMessage = '<input> [ ';
        messages.forEach(message => {
            const text = message.text.replace(/<@.*?>/g, '');
            if(text.trim().length >= 1) {
                promptMessage += `"${text}",`;
            }
        });
        promptMessage += ' ] </input>';
        console.log('promptMessage',promptMessage)

        const result = await openAIService.createChatCompletion(promptMessage);
        !isSentContext && arrayThreadSentContext.push(thread);
        if(result === null) {
            console.log('fail');
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