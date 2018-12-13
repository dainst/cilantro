import os
import json
import jsonschema


def validate_params(params, job_type):
    """
    Validate JSON string against a schema file.

    The schema file is taken from a subdirectory of the job-type definitions
    with the appendix '_schema.json'.
    """
    resource_dir = os.environ['CONFIG_DIR']
    schema_path = os.path.join(resource_dir, 'job_types', 'schemas',
                               job_type + '_schema.json')
    with open(schema_path, 'r') as schema_file:
        job_type_schema = json.loads(schema_file.read())

    jsonschema.validate(params, job_type_schema)
