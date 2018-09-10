const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true, $data: true});
const fs = require('fs');
const path = require('path');

module.exports = function validateJsonParams(req, res, next) {
    const url = req.url.split("/");

    if (req.method !== 'POST') {
        next();
    }

    const jobType = url[1];
    console.log("Validate POST param for: " + jobType);

    const file = path.resolve('../resources/schema/run_job_param_' + jobType + '.json');
    if (!fs.existsSync(file)) {
        console.log("Schema-File does not exist: " + file);
        next();
    }
    let validationSchema = JSON.parse(fs.readFileSync(file, 'utf8').toString());
    let valid = ajv.validate(validationSchema, req.body);

    if (valid) {
        console.log("OK");
        res.status(200).json({"status": "job running", "task_ids": []});
    } else {
        ajv.errors.forEach(e => console.log(e.dataPath + " " + e.message));
        res.status(500).json({
            success: false,
            message: "Post param Validation failed",
            warnings: ajv.errors.map(error => error.dataPath + " " + error.message)
        });
    }

};