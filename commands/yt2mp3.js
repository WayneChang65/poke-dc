'use strict';
const ytmp3_downloader = require('youtube-mp3-downloader');
const fmlog = require('@waynechang65/fml-consolelog').log;
const basic_f = require('../lib/basic_f.js');
const config = require('../config.json');
let apiUri = process.env.POKE_DC_RESTFUL_URI;

let gUsrMsg;
let gUuid;
const ERROR_MSG_FORMAT_TITLE = '指令格式錯誤。';
const ERROR_MSG_ID_TITLE = '影片ID錯誤。';
const ERROR_MSG_DESCRIPT = '\n格式為：yt2mp3, <影片ID> \n例如：yt2mp3, MpYy6wwqxoo';
const ERROR_MSG_FORMAT = ERROR_MSG_FORMAT_TITLE + ERROR_MSG_DESCRIPT;
const ERROR_MSG_ID = ERROR_MSG_ID_TITLE + ERROR_MSG_DESCRIPT;

let yd = new ytmp3_downloader({
    'ffmpegPath': '/usr/bin/ffmpeg', // Where is the FFmpeg binary located?
    'outputPath': config.yt2mp3_output_path, // Where should the downloaded and encoded files be stored?
    'youtubeVideoQuality': 'highest', // What video quality should be used?
    'queueParallelism': 2, // How many parallel downloads/encodes should be started?
    'progressTimeout': 2000 // How long should be the interval of the progress reports
});

yd.on('progress', function (progress) {
    //console.log(JSON.stringify(progress));
    process.stdout.write('[' + progress.videoId + ']' +
        parseInt(progress.progress.percentage) + '%...');
});

yd.on('finished', function (err, data) {
    //console.log(data);
    let aryFilename = data.file.trim().split('/');
    let filename = aryFilename[aryFilename.length - 1];
    let dl_link = 'https://' + apiUri + '/lb_images/temp/' + filename;
    console.log('\nvideoTitle: ' + data.videoTitle + '  fname: ' + filename);
    gUsrMsg.reply(data.videoTitle + '\n' + dl_link);
});

yd.on('error', function (error) {
    fmlog('error_msg', ['yt2mp3,', ERROR_MSG_ID_TITLE, error]);
    gUsrMsg.reply(ERROR_MSG_ID);
});

module.exports.run = async (discord, bot, message, args) => {
    gUsrMsg = message;
    let aryMsg = message.content.trim().split(',');
    //console.log(aryMsg);
    if (aryMsg.length !== 2 || aryMsg[aryMsg.length - 1] === ''){
        fmlog('error_msg', ['yt2mp3,', ERROR_MSG_FORMAT_TITLE, aryMsg]);
        message.reply(ERROR_MSG_FORMAT);
        return;
    }        
    let ytID = aryMsg[1].trim();
    
    fmlog('command_msg',
        [String(message.author.username), ytID, message.content, '', '', '']);

    console.log('.... [yt2mp3] Processing ....');
    gUsrMsg.reply('好的。轉檔需要時間，請耐心稍等。');
    gUuid = basic_f.uuid();
    yd.download(ytID, gUuid + '.mp3');
}

module.exports.help = {
    name:'yt2mp3,'
}