'use strict';
const fmlog = require('@waynechang65/fml-consolelog').log;
const to_webapi = require('./to_webapi.js');

let MGR_CHANNEL_1;	// 受管理的 Cheannel 1
let MGR_CHANNEL_2;	// 受管理的 Cheannel 1
let ID_CHANNEL_ANN;	// 發佈刪除訊息的 Channel
let GUILD_POKEMON_GROUP;	// 寶可夢大聯盟群組

async function _init(_mgr_channel_1, _mgr_channel_2, _id_channel_ann, _guild_pokemon_group) {
	MGR_CHANNEL_1 = _mgr_channel_1;
	MGR_CHANNEL_2 = _mgr_channel_2;
	ID_CHANNEL_ANN = _id_channel_ann;
	GUILD_POKEMON_GROUP = _guild_pokemon_group;

	fmlog('sys_msg', ['POST MANAGER', 'ACTIVE on ' + MGR_CHANNEL_1]);
	fmlog('sys_msg', ['POST MANAGER', 'ACTIVE on ' + MGR_CHANNEL_2]);
	fmlog('sys_msg', ['POST MANAGER', 'message on ' + ID_CHANNEL_ANN]);
}

async function _run(bot, message, args) {
	if (!MGR_CHANNEL_1 || !MGR_CHANNEL_2) {
		fmlog('error_msg', ['FATAL', 'MGR_CHANNEL_1 or 2 錯誤！', '請確認所管理的頻道。']);
		return;
	}
	try {
		const channel = message.channel;
		let fetched_msgs = await channel.fetchMessages({
			limit: 100
		});
		fetched_msgs = fetched_msgs.filter(m => m.author.id === message.author.id)
			.array().splice(1, fetched_msgs.size - 1);
		channel.bulkDelete(fetched_msgs);
	} catch (error) { console.log(error); }
}

async function delAllMessages(_bot, _channel) {
	const channel = _bot.channels.find(ch => ch.name === _channel);
	let fetched;
	do {
		fetched = await channel.fetchMessages({
			limit: 100
		});
		channel.bulkDelete(fetched);
	}
	while (fetched.size >= 2);

	const channel_ann = _bot.channels.get(ID_CHANNEL_ANN);
	await channel_ann.send(_channel + ' 貼文已全部刪除.');
}

async function _delAllMessagesByChannels(_event, _bot) {
	delAllMessages(_bot, MGR_CHANNEL_1);
	delAllMessages(_bot, MGR_CHANNEL_2);
}

async function _refreshMemberCount(_event, _bot) {
	let theGuild = _bot.guilds.get(GUILD_POKEMON_GROUP);
	let memberCount = theGuild.memberCount;
	let showMemberCountChannel = theGuild.channels.get(ID_CHANNEL_ANN);
	showMemberCountChannel.setName('入群通知-共' + memberCount + '人')
		.then(result => console.log('\n入群通知-共' + memberCount + '人'))
		.catch(error => console.log(error));
	
	to_webapi.sendMemberCount(memberCount);
}
module.exports = {
	run : _run,
	init : _init,
	delAllMessagesByChannels : _delAllMessagesByChannels,
	refreshMemberCount : _refreshMemberCount
}