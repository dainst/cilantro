var fs = require('fs');
var path = require('path');

var settings = {};

var contents = fs.readFileSync(path.join(__dirname,'../../../settings.php'), 'utf8');

let regex = /'(\w+)'\s*=>\s*'([^']+)'/g;
while ((m = regex.exec(contents)) !== null) {
    if (m.index === regex.lastIndex) {
        regex.lastIndex++;
    }
    if (typeof settings[m[1]] === "undefined") {
        settings[m[1]] = m[2];
    }
}

module.exports = {
    get: function(s) {
        return settings[s];
    }
};
