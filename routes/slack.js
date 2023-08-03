
const SlackBot = require("slackbots");

var bot = new SlackBot({
    token: "xoxb-5679899181829-5685493172644-5SvnVz9n9yohqfi9eL2Vj4Ca",
    name: 'Talent Picker'
});

bot.on('start', function () {
    bot.postMessageToChannel('talent-team', 'meow!');
});

exports.bot = bot;