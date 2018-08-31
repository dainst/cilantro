// const fs = require('fs');
// const path = require('path');
const promisedRequest = require('./promised_request');

const url = "http://localhost:9082"; // TODO get form protractor

function error(e) {
    console.error("Cilantro preparation could not be performed", e);
    process.exit();
}

const prepareCilantro = {

    prepare: () => new Promise((resolve, reject) => {
        promisedRequest(url + '/config/settings.json', {method: 'GET'}).then(res => {
            const settings = JSON.parse(res);
            const params = {};
            params.method = 'GET';
            if (typeof settings.server_user !== 'undefined') params.auth = settings.server_user + ':' + settings.server_pass;
            console.log("[Preparing server for testing]");
            prepareCilantro.clearStaging(settings.server_url, params)
                .then(resolve);
        })
            .catch(error);
    }),

    clearStaging: (url, params) => new Promise((resolve, reject) =>
        promisedRequest(url + 'staging', params).then(res =>
            Promise.all(JSON.parse(res).map(item =>
                promisedRequest(url + 'staging' + '/' + item.name, {...params, method: 'DELETE'})
            ))
                .then(resolve)
                .catch(error)
        )
    )
};

module.exports = prepareCilantro;