'use strict';
const fmlog = require('@waynechang65/fml-consolelog').log;

module.exports.run = async (bot, message, args) => {
    fmlog('command_msg',
    [String(message.author.username), args + 'a', message.content + 'c', '', '', 'Hello ai.']);
}

module.exports.help = {
	name: 'ai'
}