const SlackAppSocket = require('../services/SlackAppSocket.service');
const OpenAIService = require('../services/OpenAI.service');
const {MessageBuilder} = require('@slack/bolt');
const EmployeeRepository = require('../repositories/employee.repository');
const candidateFilterService = require('../services/CandidateFilter.service')
require('dotenv').config()


console.log(process.env.SLACK_TOKEN);
const BOT_TAG_NAME = '<@U05LFJT7RUZ>';

const app = SlackAppSocket.getApp();
const openAIService = new OpenAIService();
async function test() {
    const message = await openAIService.getSuccessMessage();
    console.log(message)
}
test()
app.message(async ({message, say}) => {
    if (message.text.includes(BOT_TAG_NAME)) {

        const messages = await SlackAppSocket.getMessagesInThread(message);
        let promptMessage = openAIService.messagesToInput(messages);

        const result = await openAIService.createChatCompletion(promptMessage);
        console.log('result',result)
        const employeeRepository = new EmployeeRepository();
        if (result === null) {
            await say({
                text: `Hi, <@${message.user}>  I don\'t understand what you mean, please call me again once you have more information.`,
                thread_ts: message.ts
            })

            return;
        } else if (result.status === 'success') {

            const employees = await candidateFilterService.getCandidates(result);

            if(employees.length === 0) {
                await say({
                    text: `<@${message.user}>  I found no candidates matching your requirements. Please try again.`,
                    thread_ts: message.ts
                })

                return;
            }

            let displayMessage = `<@${message.user}>, ` + await openAIService.getSuccessMessage();

            await say({
                thread_ts: message.ts,
                text: 'Here is the result',
                blocks: [
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: displayMessage,
                        }
                    },
                    {
                        type: 'divider',
                    },
                    ...employeeRepository.employeesToBlockItems(employees)
                    ,
                    {
                        type: 'divider',
                    },
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: 'Next step',
                        },
                        accessory: {
                            type: 'button',
                            text: {
                                type: 'plain_text',
                                text: 'Process interview',
                            },
                            style: "primary",
                            action_id: 'button_link_clicked',
                        },
                    },
                ],
            })
            await say({
                text: 'Don\'t hesitate to call me again if you want to add/remove any requirements.',
                thread_ts: message.ts,
            })

        } else {
            await say({
                text: `<@${message.user}>`+result.message,
                thread_ts: message.ts
            })
        }


    }
});

app.action('choose_employee', async ({body, ack, say, action}) => {
    const id = action.value;
    let blocks = body.message.blocks;
    for(let i = 0; i < blocks.length; i++) {
        if(blocks[i]?.accessory?.value == id) {
            if(blocks[i].accessory.text.text == 'Selected') {
                blocks[i].accessory.text.text = 'Choose'
            }else if(blocks[i].accessory.text.text == 'Choose') {
                blocks[i].accessory.text.text = 'Selected'
            }
        }
    }

    await ack();
    await app.client.chat.update({
        token: process.env.SLACK_TOKEN,
        channel: body.channel.id,
        ts: body.message.ts,
        blocks: blocks,
        text: 'Here is the result',
    })
});

(async () => {
    await app.start();
    console.log('⚡️ Bolt app is running!');
})();


exports.bot = app;