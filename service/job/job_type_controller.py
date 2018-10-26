import os
import yaml

from flask import Blueprint, jsonify

from service.errors import ApiError

job_type_controller = Blueprint('job_types', __name__)

config_dir = os.environ['CONFIG_DIR']
job_types_dir = os.path.join(config_dir, 'job_types')


@job_type_controller.route('', methods=['GET'])
def get_job_types():
    r"""
    Return a JSON list of available job types and their meta information.

    .. :quickref: Job Type Controller; \
        Return a JSON list of available job types and their meta information.

    **Example request**:

    .. sourcecode:: http

      GET /job_types/ HTTP/1.1

    **Example response**:

    .. sourcecode:: http

      HTTP/1.1 200 OK

      TODO

    :reqheader Accept: application/json

    :resheader Content-Type: application/json
    :>json dict: operation result
    :status 200: OK

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
    r"""
    Serve the contents of the YAML file for the job type definition.

    .. :quickref: Job Type Controller; \
        Serves the contents of the YAML file for the job type definition.

    **Example request**:

    .. sourcecode:: http

      GET /job_types/<job_type> HTTP/1.1

    **Example response**:

    .. sourcecode:: http

      HTTP/1.1 200 OK

      TODO

    :reqheader Accept: application/json
    :param str job_type: Name of the job type

    :resheader Content-Type: application/json
    :>json dict: operation result
    :status 200: OK

    :return: YAML file content of the job type
    """
    try:
        with open(os.path.join(job_types_dir, job_type) + '.yml', 'r') as f:
            return jsonify(yaml.safe_load(f.read()))
    except FileNotFoundError:
        raise ApiError(
            "job_type_not_found",
            f"No definition for given job type '{job_type}' found",
            404
            )
