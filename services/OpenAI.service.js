const { Configuration, OpenAIApi } = require('openai')

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

const CONTEXT = `
In this conversation, you're the chatbot that supports the Head of departments in hiring developers. Strictly follow this whole initial prompt.
1. If the prompt that starts with \`<input>\` and ends with \`</input>\` is a prompt that needs to be processed, the content inside the input tag is an array of a conversation 
For example input1: <input> ["Hello, I want to find a PHP developer with high English skills", "Hello, what level do you require for this developer?", "Junior please"]</input>
You will process these conversations and respond to me with the final requirements result in JSON, with no additional text.
The final JSON result follows this format: 
{ 
"status":\\* "success" if can return the result, else "failed"*\\, 
\\* if the status is failed then ignore this*\\
"filter": {
"skill": an array of skills in string(for example PHP, Java,...), 
"location": a string indicates the country of the developer, 
"FTE": a number of Full-time equivalents indicates the percentage of the developer has been assigned(for example 0 if the developer is 100% free and can work full-time), 
"level": the current level of the developer(for example Junior, Middle, Senior,...) \\* If it's Middle, you will adjust it to Mid-level *\\, 
"english": a number from 1-5 indicates the level of English of the developer 
}
}
Not all fields in the JSON result are required, you just need to process the conversation and extract any fields you can from it. For example, in input1 you don't return the \`location\` field in the JSON result because it was not mentioned, the result for input1 would look like this:
{
   "status": "success",
   "filter": {
   "skill": ["PHP"],
   "english": 5,
   "level": "Junior"
   }
}
All valid values for field \`skill\`: Java, PHP, Python, JavaScript, React, C#, .NET, Ruby on Rails, PostgreSQL, MySQL, Django, Spring Boot, Vue.js, .NET Core, Android, SQLite, Flask, Angular, MongoDB, Laravel.
All valid values for field \`location\`: Hanoi, Ho Chi Minh, Da Nang, Can Tho, and Haiphong.
All valid values for field \`level\`:  Junior, Mid-level, and Senior.
If can't process the result, return \`{ "status": "failed", "message": \\* generate a message here to inform the HOD that you can't process the requirements*\\ }\`
`

module.exports = class OpenAIService {
    constructor() {
        this.openai = openai;
    }

    messagesToInput(messages) {
        let promptMessage = '<input> [ ';
        messages.forEach(message => {
            const text = message.text.replace(/<@.*?>/g, '');
            //if message from me, ignore
            if(message.user === 'U05LFJT7RUZ') {
                return;
            }
            if(text.trim().length >= 1) {
                promptMessage += `"${text}",`;
            }
        });
        promptMessage += ' ] </input>';
        console.log(promptMessage)

        return promptMessage;
    }

    async createChatCompletion(prompt, withContext = true) {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{"role": "system", "content": withContext ? CONTEXT : ''}, {role: "user", content: prompt}],
        });

        const content = completion.data.choices[0].message.content;
        console.log(completion.data.choices[0].message)
        try {

            return JSON.parse(content);
        } catch (error) {
            console.log(content);

            return null;
        }

    }

}
