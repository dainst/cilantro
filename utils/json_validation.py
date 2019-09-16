import os
import json
import jsonschema


resource_dir = os.environ['CONFIG_DIR']


def validate_params(params, job_type):
    """
    Validate JSON string against a schema file.

    The schema file is taken from a config subdirectory.
    """
    schema_path = os.path.join(resource_dir, 'job_parameter_schemas',
                               job_type + '_schema.json')
    with open(schema_path, 'r') as schema_file:
        job_type_schema = json.loads(schema_file.read())

    jsonschema.validate(params, job_type_schema)


def get_schema(job_type):
    """Read and return the schema file for the given job type."""
    schema_path = os.path.join(resource_dir, 'job_parameter_schemas',
                               job_type + '_schema.json')
    with open(schema_path, 'r') as schema_file:
        job_type_schema = json.loads(schema_file.read())

    return job_type_schema
