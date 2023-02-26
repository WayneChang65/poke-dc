'use strict';

module.exports.run = async (discord, bot, message, args) => {
    const botMsg = 
        `波可小妹ロボ指令說明
        ***指令：__iv,__***
            功能：查詢寶可夢iv值
        ***指令：__ai__***
            功能：AI助理，可以問任何問題    
        `;
    message.reply(botMsg);
};

module.exports.help = {
    name: 'help',
};
