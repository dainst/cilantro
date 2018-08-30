// const fs = require('fs');
// const path = require('path');
const promisedRequest = require('./promised_request');


const url = "http://localhost:9082"; // TODO get form protractor

module.exports = {
    run: () => new Promise((resolve, reject) => {

        // get server url
        promisedRequest(url + '/config/settings.json', {method: 'GET'}).then(res => {
            console.log(url + '/config/settings.json');
            console.log(res);
            resolve();
        });


        // get staging dir
        // promisedRequest(cilantro + '/staging', {'method': 'GET'}).then(res => {
        //     console.log(cilantro + '/staging');
        //     console.log(res);
        //     resolve();
        // })



        // delete everything


        // upload testdata


    })
};