'use strict';
let request = require('request');
let apiUri = process.env.POKE_DC_RESTFUL_URI;

function _sendStatus() {
    let url = 'https://' + apiUri + '/pokedc/status';
    let options = {
        'method': 'POST',
        'url': url,
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            'isalive': 'true',
            'online' : 'ONLINE'
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

function _sendMemberCount(_counts) {
    let url = 'https://' + apiUri + '/pokedc/statistics/users';
    let options = {
        'method': 'POST',
        'url': url,
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            'counts': _counts
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
        _sendStatus();
    }, 2.5 * 60 * 1000);  // 2.5 min
}

//////////////  Module Exports //////////////////
module.exports = {
    run : _run,
    sendMemberCount : _sendMemberCount
};