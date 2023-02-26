'use strict';
const Discord = require('discord.js');
const config = require('./config.json');
const bot = new Discord.Client();
const fs = require('fs');
const fmlog = require('@waynechang65/fml-consolelog').log;
const to_webapi = require('./lib/to_webapi.js');

bot.commands = new Discord.Collection();

const bot_token = process.env.POKE_DC_TOKEN;

if (!bot_token) {
	fmlog('error_msg', ['FATAL', 'TOKEN 錯誤！', '請至https://www.discordapp.com/developers 確認']);
	return;
}

fs.readdir('./commands/', (err, files) => {
	if (err) console.log(err);

	let jsfile = files.filter(f => f.split('.').pop() === 'js');
	if (jsfile.length <= 0) {
		fmlog('error_msg', ['FATAL', '找不到Command!', '請確認Command檔名及help屬性文字']);
		return;
	}
	jsfile.forEach((f, i) => {
		let props = require(`./commands/${f}`);
		fmlog('sys_msg', [props.help.name, '指令載入.']);
		bot.commands.set(props.help.name, props);
	});
	console.log('');
});

bot.on('ready', () => {
	fmlog('sys_msg', ['READY', bot.user.username.toString() + ' is ONLINE.']);
	to_webapi.run();	// 將本伺服器的狀態傳到 Web API(維護 alive...)
});

bot.on('guildMemberAdd', member => {
});

bot.on('guildMemberRemove', member => {
});

bot.on('message', async message => {
	if (message.author.bot) return;
	if (message.channel.type === 'dm') return;
	let content = message.content.split(' ');
	let command = content[0];
	let args = content.slice(1);
	let prefix = config.prefix;

	let commandfile = bot.commands.get(command.slice(prefix.length));
	if (commandfile) {
		console.log('');
		commandfile.run(bot, message, args);
	} else {
		process.stdout.write('.');
	}
})

bot.on('error', () => {
	console.error();
});

bot.login(bot_token);