'use strict';
//const taggle_msg = require('../lib/taggle_msg.js');
//const scheduling = require('../lib/schedling.js');

module.exports.run = async (discord, bot, message, args) => {
	//taggle_msg.warningOverNightToDrivers(null, bot);
	/*
	scheduling.setCyclicTimer_Do_EveryInterval(null, bot, async () => {
		const channel_drivers = bot.channels.find(ch => ch.name === 'push_test');
		console.log('a');
		await channel_drivers.send('msg').then(m => m.delete(3 * 1000));
	}, 
	1000 * 10, 'string1', 'string2');
	*/
}
//name this whatever the command name is.
module.exports.help = {
	name: 'tg__1234'
}