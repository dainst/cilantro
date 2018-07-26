import os
import yaml

from flask import Blueprint, jsonify

from service.errors import ApiError

job_type_controller = Blueprint('job_types', __name__)

config_dir = os.environ['CONFIG_DIR']
job_types_dir = os.path.join(config_dir, 'job_types')


@job_type_controller.route('', methods=['GET'])
def get_job_types():
    """
    Return a JSON list of available job types and their meta information.

    :return str: JSON list of objecta containing the type names and
                 the about information from the file
    """
    job_types = []
    for job_type_file in os.listdir(job_types_dir):
        job_name = job_type_file.rsplit('.', 1)[0]
        with open(os.path.join(job_types_dir, job_type_file), 'r') as f:
            job_file_yaml = yaml.safe_load(f.read())
            job_meta = job_file_yaml['about']
        job_types.append({'name': job_name,
                          'about': job_meta})

    return jsonify(job_types)


@job_type_controller.route('<job_type>', methods=['GET'])
def get_job_type_detail(job_type):
    """
    Serves the contents of the YAML file for the job type definition.

    :param str job_type: Name of the job
    :return: YAML file content fo the job type
    """
    try:
        with open(os.path.join(job_types_dir, job_type) + '.yml', 'r') as f:
            return jsonify(yaml.safe_load(f.read()))
    except FileNotFoundError:
        raise ApiError("Job type not found", 404)
