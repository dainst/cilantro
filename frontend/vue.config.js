process.env.VUE_APP_VERSION = require('./package.json').version
process.env.VUE_APP_GITHASH = require('child_process').execSync('git rev-parse HEAD')

module.exports = {
    lintOnSave: false
};
