import os
import json
import jsonschema

resource_dir = 'resources'

def validate_params(params, job_type):

    with open(os.path.join(resource_dir, job_type + '_schema.json'), 'r') as schema_file:
        job_type_schema = json.loads(schema_file.read())

    jsonschema.validate(params, job_type_schema)
