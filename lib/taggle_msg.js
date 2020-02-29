'use strict';
const fmlog = require('@waynechang65/fml-consolelog').log;
const config = require("../config.json");

let CHANNEL_ROLES_CHOSE = config.id_channel_roles_chose; 		// 身份組選擇區
let CHANNEL_ANNOUNCE = config.id_channel_announce; 				// 公告區
let TMSG_CHANNEL_DRIVERS = config.taggle_msg_channel_drivers;	// 極巨戰-約戰區
let ROLE_ID_DRIVERS = config.id_role_drivers;     				// 無限列車長身份組
let ID_CHANNEL_ANN = config.id_channel_ann;						// 入群通知
let MGR_CHANNEL_1 = config.post_mgr_channel_1;					// 交易區

async function _newbieJoined(_member) {
	const channel = _member.guild.channels.get(ID_CHANNEL_ANN);
	if (!channel) return;

	let msg = `${_member}` + '您好，歡迎加入這個大家庭。請注意以下兩件事：\n' +
		'1. 請到' + _member.guild.channels.get(CHANNEL_ROLES_CHOSE).toString() +
		'點選您的身份組。點選完之後，對應的頻道就會顯示出來。\n' +
		'2. 請到' + _member.guild.channels.get(CHANNEL_ANNOUNCE).toString() +
		'，看一下公告，並了解相關注意事項。另外，也請將劍盾玩家把SW碼或GO玩家代碼加在個人名字後面，以利互加好友，謝謝。\n' +
		'(本訊息將30分鐘後自動刪除)';
	console.log('');
	fmlog('event_msg', ['JOIN', `${_member}`, '新人加入！']);
	channel.send(msg).then(m => m.delete(30 * 60 * 1000)); // del msg after 30 mins
}

async function _warningOverNightToDrivers(_event, _bot) {
    const channel_drivers = _bot.channels.find(ch => ch.name === TMSG_CHANNEL_DRIVERS);
    let role_drivers = channel_drivers.guild.roles.get(ROLE_ID_DRIVERS);
    let msg = role_drivers + ' :warning: ' + 
        '各位帥哥美女列車長們，再過**10分鐘**準備過日囉。請關掉您的Switch，或調整時間，免得砸坑。';
    console.log('_warningOverNightToDrivers ---' + msg);
	
	// 10分鐘後自行刪除
	await channel_drivers.send(msg).then(m => m.delete(10 * 60 * 1000));
}

async function _warningTradeMsg(_event, _bot, _timeSpan) {
	const channel_drivers = _bot.channels.find(ch => ch.name === MGR_CHANNEL_1);
		const msg = '各位親愛的訓練家朋友們，交易時請提高自我保護意識，謹防上當受騙。' +
			'另外本交易所**只會保留訓練家最新發表的一則訊息～ 舊訊息將被自動焚毀**，請大家注意喔！最後祝大家遊戲愉快 030';

		await channel_drivers.send(msg).then(m => m.delete(_timeSpan - 1000 * 5));
}

module.exports = {
    newbieJoined : _newbieJoined,
	warningOverNightToDrivers : _warningOverNightToDrivers,
	warningTradeMsg : _warningTradeMsg
}