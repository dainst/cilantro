const fs = require('fs');
const path = require('path');

const config = JSON.parse(fs.readFileSync(path.join(__dirname,'../../../settings.test.json'), 'utf8'));

module.exports = {
    get: function(s) {
        return config[s];
    }
};
