const { Configuration, OpenAIApi } = require('openai')

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

const CONTEXT = `
In this conversation, you're the chatbot that supports the Head of departments in hiring developers. Strictly follow this whole initial prompt.
1. The prompt that starts with \`<input>\` and ends with \`</input>\` is a prompt that needs to be processed, the content inside the input tag is an array of a conversation
For example input1: <input> ["Hello, I want to find a PHP developer with high english skills", "Hello, what level do you require for this developer?", "Junior please"]</input>
You will process these conversations and respond to me with the final requirements result in JSON, with no additional text.
The final JSON result follows this format:  { "status":\\* "success" if can return the result, else "failed"*\\, \\* if status is failed then ignore this*\\"filter": {"skill": an array of skills in string(for example PHP, Java,...), "location": a string indicates the country of the developer, "FTE": a number of Full-time equivalent indicates the percentage of developer has been assigned(for example 0 if the developer is 100% free and can work full time), "level": the current level of the developer(for example Junior, Middle, Senior,...), "english": a number from 1-5 indicates the level of English of the developer }}.
Not all fields in the JSON result are required, you just need to process the conversation and extract any fields you can from it. For example, in input1 you don't return the location field in the JSON result because it was not mentioned, the result for input1 look like this:
{
"status": "success",
"filter": {
"skill": ["PHP"],
"english": 5,
"level": "Junior"
}
}
If can't process the result, return "failed".
2. The prompts that starts with \`<add>\` and ends with </add>  indicating the contents inside it is additional to the \`<input>\` tag sent before it.
For example: <add>I want a developer located in Germany</add>
If there is no \`<input>\` prompt before this prompt, return { "status":"failed"}
Process this as additional information for your last response.
`

module.exports = class OpenAIService {
    constructor() {
        this.openai = openai;
    }

    messagesToInput(messages) {
        let promptMessage = '<input> [ ';
        messages.forEach(message => {
            const text = message.text.replace(/<@.*?>/g, '');
            if(text.trim().length >= 1) {
                promptMessage += `"${text}",`;
            }
        });
        promptMessage += ' ] </input>';

            return promptMessage;
    }

    async createChatCompletion(prompt, withContext = true) {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{"role": "system", "content": withContext ? CONTEXT : ''}, {role: "user", content: prompt}],
        });

        const content = completion.data.choices[0].message.content;
        try {
            const json = JSON.parse(content);
            if(json.status === 'success') {
                return json;
            }
        } catch (error) {
            console.log(error);
        }

        return null;
    }
}
