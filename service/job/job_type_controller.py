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

    .. :quickref: Job Type Controller; \
        Return a JSON list of available job types and their meta information.

    **Example request**:

    .. sourcecode:: http

      GET /job_types/ HTTP/1.1

    **Example response**:

    .. sourcecode:: http

        HTTP/1.1 200 OK

        [
            {
                "about": {
                    "description": "Create a new Issue of an existing
                                    journal, and upload it's files to
                                    iDAI.publications/journals",
                    "tags": [
                        "OJS",
                        "iDAI.publications/journals",
                        "publish",
                        "journal",
                        "pdf"
                    ],
                    "title": "Ingest a Journal-Issue to
                              iDAI.publications/journals"
                },
                "name": "ingest_journal"
            },
            {
                "about": {
                    "description": "Create a new Book afrom single image
                                    files nd upload it to iDAI.repository",
                    "tags": [
                        "repository",
                        "book",
                        "monography",
                        "image",
                        "tiff"
                    ],
                    "title": "Ingest a complete book to iDAI.repository"
                },
                "name": "ingest_book"
            }
        ]

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
    """
    Serve the contents of the YAML file for the job type definition.

    .. :quickref: Job Type Controller; \
    Serves the contents of the YAML file for the job type definition.

    **Example request**:

    .. sourcecode:: http

      GET /job_types/<job_type> HTTP/1.1

    **Example response**:

    .. sourcecode:: http

        HTTP/1.1 200 OK

        {
            "about": {
                "description": "Create a new Issue of an existing journal
                                and upload it's files to
                                iDAI.publications/journals",
                "tags": [
                    "OJS",
                    "iDAI.publications/journals",
                    "publish",
                    "journal",
                    "pdf"
                ],
                "title": "Ingest a Journal-Issue to iDAI.publications/journals"
            },
            "params": {
                "do_ocr": "boolean",
                "files": "list",
                "metadata": "dict",
                "nlp_params": "dict",
                "ojs_metadata": "dict",
                "parts": "list"
            },
            "tasks": [
                "create_object",
                {
                    "foreach": [
                        {
                            "do": [
                                {
                                    "foreach": {
                                        "target": "tif",
                                        "task": "convert.pdf_to_tif"
                                    },
                                    "list_files": "origin",
                                    "pattern": ".*\\.pdf$"
                                },
                                {
                                    "foreach": {
                                        "target": "txt",
                                        "task": "convert.tif_to_txt"
                                    },
                                    "list_files": "tif"
                                },
                                {
                                    "foreach": {
                                        "target": "jpg",
                                        "task": "convert.tif_to_jpg"
                                    },
                                    "list_files": "tif"
                                }
                            ],
                            "else": [
                                {
                                    "foreach": {
                                        "target": "txt",
                                        "task": "convert.pdf_to_txt"
                                    },
                                    "list_files": "origin",
                                    "pattern": ".*\\.pdf$"
                                }
                            ],
                            "if": "do_ocr"
                        },
                        {
                            "source": "txt",
                            "task": "nlp.annotate"
                        }
                    ],
                    "list_parts": null
                },
                {
                    "foreach": {
                        "foreach": {
                            "max_height": 50,
                            "max_width": 50,
                            "task": "image.scaling"
                        },
                        "list_files": "jpg"
                    },
                    "list_parts": null
                },
                {
                    "foreach": {
                        "foreach": {
                            "max_height": 50,
                            "max_width": 50,
                            "task": "image.scaling"
                        },
                        "list_files": "tif"
                    },
                    "list_parts": null
                },
                {
                    "dtd_file": "ojs_import.dtd",
                    "params": "ojs_metadata",
                    "target_filename": "ojs_import.xml",
                    "task": "generate_xml",
                    "template_file": "ojs_template.xml"
                },
                {
                    "foreach": {
                        "schema_file": "MARC21slim.xsd",
                        "target_filename": "marc.xml",
                        "task": "generate_xml",
                        "template_file": "marc_template.xml"
                    },
                    "list_parts": null
                },
                {
                    "foreach": {
                        "schema_file": "mets.xsd",
                        "target_filename": "mets.xml",
                        "task": "generate_xml",
                        "template_file": "mets_template.xml"
                    },
                    "list_parts": null
                },
                {
                    "params": "ojs_metadata",
                    "task": "publish_to_ojs"
                },
                {
                    "foreach": {
                        "task": "generate_frontmatter"
                    },
                    "list_parts": null
                },
                "publish_to_repository",
                "cleanup_workdir",
                "finish_job"
            ]
        }

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
            404)
