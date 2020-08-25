'use strict';
const Discord = require('discord.js');
const config = require('./config.json');
const bot = new Discord.Client();
const fs = require('fs');
const fmlog = require('@waynechang65/fml-consolelog').log;
const post_mgr = require('./lib/post_mgr.js');
//const scheduling = require('./lib/schedling.js');
const taggle_msg = require('./lib/taggle_msg.js');
const to_webapi = require('./lib/to_webapi.js');

bot.commands = new Discord.Collection();

const MGR_CHANNEL_1 = config.post_mgr_channel_1;	// 交易區
const MGR_CHANNEL_2 = config.post_mgr_channel_2;	// Home交易區
const ID_CHANNEL_ANN = config.id_channel_ann;
const GUILD_POKEMON_GROUP = config.guild_pokemon_group;

const bot_token = process.env.POKE_DC_TOKEN;

const c = {
	TODAY: 0,
	TOMORROW: 1
}

let fullTxtOut_Flag = true;

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
	console.log('');
	post_mgr.init(MGR_CHANNEL_1, MGR_CHANNEL_2, ID_CHANNEL_ANN, GUILD_POKEMON_GROUP);
	console.log('');
	post_mgr.refreshMemberCount(null, bot);

	to_webapi.run();	// 將本伺服器的狀態傳到 Web API(維護 alive...)
	// .....................................................................................
	// 重要重要重要！！！！ 要使用時間功能，請在CentOS伺服器上運作或測試，不然Mac電腦時間不對，會誤觸發！
	// .....................................................................................

	//等公告後，再打開來，整個清除。(建新區) 
	//scheduling.setCyclicTimer_Do_Every_10_days(undefined, bot, post_mgr.delAllMessagesByChannels,
	//	'23:58', c.TOMORROW, '交換與買賣區清除!', '交換買賣區清除 Timer ON!');

	// 覺得沒必要，先關掉。
	/*
	scheduling.setCyclicTimer_Do_Everyday(undefined, bot, taggle_msg.warningOverNightToDrivers,
		'23:50', c.TODAY, '車長換日提醒', '車長換日提醒 Timer ON!');
	*/

	// 覺得沒必要，先關掉。
	/*
	const timeSpan = 1000 * 60 * 10; // 10分鐘
	taggle_msg.warningTradeMsg(undefined, bot, timeSpan, MGR_CHANNEL_1);
	scheduling.setCyclicTimer_Do_EveryInterval(null, bot, taggle_msg.warningTradeMsg, 
		timeSpan, MGR_CHANNEL_1, '買賣區規則提醒', '買賣區規則提醒 Timer ON!');
	
	taggle_msg.warningTradeMsg(undefined, bot, timeSpan, MGR_CHANNEL_2);
	scheduling.setCyclicTimer_Do_EveryInterval(null, bot, taggle_msg.warningTradeMsg, 
		timeSpan, MGR_CHANNEL_2, 'home買賣區規則提醒', 'home買賣區規則提醒 Timer ON!');	
	*/	
});

bot.on('guildMemberAdd', member => {
	taggle_msg.newbieJoined(member);
	post_mgr.refreshMemberCount(null, bot);
});

bot.on('guildMemberRemove', member => {
	post_mgr.refreshMemberCount(null, bot);
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
		if (message.channel.name === MGR_CHANNEL_1 ||
			message.channel.name === MGR_CHANNEL_2) {
			console.log('');
			fmlog('basic_msg', ['POST MANAGER', String(message.author.username),
				String(message.channel.name) + ' 指令處理', ''
			]);
			post_mgr.run(bot, message, null);
			fullTxtOut_Flag = true;
			//return; // 如果進 買賣區，就不執行後面指令
		} else {
			if (fullTxtOut_Flag) {
				console.log('');
				fullTxtOut_Flag = false;
			} else {
				process.stdout.write('.');
			}
		}
	}
})

bot.on('error', () => {
	console.error();
});

bot.login(bot_token);