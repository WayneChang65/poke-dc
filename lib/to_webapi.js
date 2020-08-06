'use strict';
let request = require('request');
let apiUri = process.env.POKE_DC_RESTFUL_URI;

function _sendInfoToWebAPI() {
    let url = 'http://' + apiUri + '/pokedc/status';
    let options = {
        'method': 'POST',
        'url': url,
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            'isalive': 'true'
        }
    };

    request(options, function (error, response) {
        if (error) {
            //throw new Error(error);
            process.stdout.write('?');
        } else {
            //console.log(response.body);
            process.stdout.write('^');
        }
    });
}

function _run() {
    setInterval(() => {
        _sendInfoToWebAPI();
    }, 10 * 1000);  // 10 sec
}

//////////////  Module Exports //////////////////
module.exports = {
    run : _run
};