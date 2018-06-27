let Ajv = require('ajv');
let ajv = new Ajv({allErrors: true, $data: true});
let fs = require('fs');
let files = fs.readdirSync(__dirname + '/schema/');
const regex = /.*\.json/;




files.filter((file) => file.match(regex)).forEach(function(file) {
    console.log("[Validate " + file + "]");
    let validationSchema = JSON.parse(fs.readFileSync(__dirname + '/schema/' + file, 'utf8').toString());
    let toValidate = JSON.parse(fs.readFileSync(__dirname + '/schema/example/' + file, 'utf8').toString());
    let valid = ajv.validate(validationSchema, toValidate);
    if (valid) {
        console.log("OK");
    } else {
        ajv.errors.forEach(e => console.log(e.dataPath + " " + e.message));
    }
});
