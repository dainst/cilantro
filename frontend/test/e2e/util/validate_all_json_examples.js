// script to validate the examples in resources/schema
// run with nodejs test/e2e/util/validate_all_json_examples.js
const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true, $data: true});
const fs = require('fs');
const files = fs.readdirSync(__dirname + '/../resources/schema/');
const regex = /.*\.json/;


files.filter((file) => file.match(regex)).forEach(function(file) {
    console.log("[Validate " + file + "]");
    let validationSchema = JSON.parse(fs.readFileSync(__dirname + '/../resources/schema/' + file, 'utf8').toString());
    let toValidate = JSON.parse(fs.readFileSync(__dirname + '/../resources/schema/example/' + file, 'utf8').toString());
    let valid = ajv.validate(validationSchema, toValidate);
    if (valid) {
        console.log("OK");
    } else {
        ajv.errors.forEach(e => console.log(e.dataPath + " " + e.message));
    }
});
