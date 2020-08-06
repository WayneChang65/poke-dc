'use strict';
let request = require('request');
let apiUri = process.env.POKE_DC_RESTFUL_URI;

function _sendInfoToWebAPI() {
    let url = apiUri + '/pokedc/status';
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
        if (error) throw new Error(error);
        console.log(response.body);
    });
}

function _run() {
    setInterval(() => {
        _sendInfoToWebAPI();
    }, 1000);
}

//////////////  Module Exports //////////////////
module.exports = {
    run : _run
};