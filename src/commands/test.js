const { Message } = require("discord.js");
const Bot = require("../bot");
const util = require('util');

module.exports.help = 'Test args';
module.exports.usage = '#PREFIXtest';
module.exports.required_permissions = ['BOT_OWNER'];
module.exports.args_list =  {
    position_independent: false,
    args: [{
        name: 'arg1',
        type: 'string',
        description: 'Arg1 test is a string'
    }, {
        name: 'arg2',
        type: 'user',
        description: 'Arg1 test is a user mention (user for slash commands)'
    }],
    optional_args: []
};

/**
 * @param {Bot} bot Bot object that called
 * @param {Map} args Map of arguments
 * @param {Message} msg Message Object
 */
module.exports.main = async (bot, args, msg) => {
    bot.logger.debug(`test command: got args: ${util.inspect(args)}`);
    msg.respond_info(`hello ${bot.client.users.cache.get(args.get("arg2")).username} you said ${args.get("arg1")}`);
}
