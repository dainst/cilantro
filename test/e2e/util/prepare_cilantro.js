const fs = require('fs');
const path = require('path');
const rp = require('request-promise-native');

let frontendUrl = "";
let backendUrl = "";
let params = {};
let silent = false;

function getParams() {
    return new Promise((resolve, reject) => {
        rp({uri: frontendUrl + '/config/settings.json', method: 'GET'}).then(res => {
            const settings = JSON.parse(res);
            backendUrl = settings.server_url;
            params = {};
            params.method = 'GET';
            if (typeof settings.server_user !== 'undefined') {
                params.auth = {
                    user: settings.server_user,
                    pass: settings.server_pass
                };
            }
            resolve(params);
        })
            .catch(reject)
    });
}

function clearStaging() {
    return new Promise((resolve, reject) =>
        rp({...params, uri: backendUrl + 'staging'}).then(res =>
            Promise.all(JSON.parse(res).map(item => {
                if (!silent) console.log("Delete", item.name);
                return rp({...params, uri: backendUrl + 'staging' + '/' + item.name, method: 'DELETE'})
            }))
                .then(resolve)
        )
            .catch(reject)
    );
}

function clearSingleFile(file) {
    if (!silent) console.log("Delete", file);
    return rp({...params, uri: backendUrl + 'staging' + '/' + file, method: 'DELETE'})
}

function fillStaging() {
    return new Promise((resolve, reject) => {
        const formData = {};
        const testResDir = path.join(__dirname, '../resources/staging/');
        function readDir(path, target) {
            if (fs.lstatSync(testResDir + path).isDirectory()) {
                fs.readdirSync(testResDir + path).forEach(entry => readDir(path + '/' + entry, target));
            } else if (fs.lstatSync(testResDir + path).isFile()) {
                if (!silent) console.log("Upload", path);
                target[path] = {
                    value:  fs.createReadStream(testResDir + path),
                    options: {
                        filepath: path.replace('/', '\\') // see form-data/lib/form_data.js l. 225
                    }
                };
            }
        }
        readDir('', formData);

        rp({...params, uri: backendUrl + 'staging', method: 'POST', formData: formData}).then(res => {
            const result = JSON.parse(res).result;
            const success = Object.values(result).reduce((all, x) => all && x.success, true);

            if (success) {
                resolve();
            } else {
                console.log(result);
                reject({stack: "Staging Dir Preparation Failed"});
            }
        });
    })
}

const pc = {

    prepare: url => new Promise((resolve, reject) => {
        frontendUrl = url;
        if (!silent) console.log("Salvia on " + frontendUrl);
        getParams()
            .then(clearStaging)
            .then(fillStaging)
            .then(resolve)
            .catch(reject)
    }),
    
    cleanUp: url => new Promise((resolve, reject) => {
        frontendUrl = url;
        getParams()
            .then(clearStaging)
            .then(resolve)
            .catch(reject)
    }),

    clearSingleFile: (url, file) => new Promise((resolve, reject) => {
        frontendUrl = url;
        getParams()
            .then(() => clearSingleFile(file))
            .then(resolve)
            .catch(reject)
    }),

    silent: to => {
        silent = to || !silent
    }
};

module.exports = pc;