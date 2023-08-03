const SlackAppSocket = require('../services/SlackAppSocket.service');
const OpenAIService = require('../services/OpenAI.service');
const {MessageBuilder} = require('@slack/bolt');
const EmployeeRepository = require('../repositories/employee.repository');
const candidateFilterService = require('../services/CandidateFilter.service')
require('dotenv').config()


console.log(process.env.SLACK_TOKEN);
const BOT_TAG_NAME = '<@U05LFJT7RUZ>';

const app = SlackAppSocket.getApp();
app.message(async ({message, say}) => {
    if (message.text.includes(BOT_TAG_NAME)) {
        const openAIService = new OpenAIService();
        const messages = await SlackAppSocket.getMessagesInThread(message);
        let promptMessage = openAIService.messagesToInput(messages);

        const result = await openAIService.createChatCompletion(promptMessage);
        console.log('result',result)
        const employeeRepository = new EmployeeRepository();
        if (result === null) {
            await say({
                text: `Hi, <@${message.user}>  I don\'t understand what you mean, please try tag me again with more detail information.`,
                thread_ts: message.ts
            })

            return;
        } else if (result.status === 'failed') {
            await say({
                text: `⚠️<@${message.user}>`+result.message,
                thread_ts: message.ts
            })

            return;
        }

        const employees = await candidateFilterService.getCandidates(result);
        console.log('employees',employees)

        await say({
            thread_ts: message.ts,
            blocks: [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `Hi, <@${message.user}>, I found ${employees.length} employees match your criteria:\n\n${employeeRepository.employeesToList(employees)}`,
                    },
                    accessory: {
                        type: 'button',
                        text: {
                            type: 'plain_text',
                            text: 'View result in web app',
                        },
                        url: 'https://www.example.com',
                        action_id: 'button_link_clicked',
                    },
                },
            ],
        })

        const filterKeys = result.filter;
        if (Object.keys(filterKeys).length <= 3) {
            await say({
                text: 'Do you want to add/update your requirements?',
                thread_ts: message.ts,
            })
        }
    }
});

(async () => {
    await app.start();
    console.log('⚡️ Bolt app is running!');
})();


exports.bot = app;