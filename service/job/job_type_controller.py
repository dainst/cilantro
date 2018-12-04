import os
import yaml
import glob

from flask import Blueprint, jsonify, request

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
    for job_type_file in glob.glob(job_types_dir + '/*.yml'):
        job_name = os.path.basename(job_type_file).rsplit('.', 1)[0]
        with open(job_type_file, 'r') as f:
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
                "description": "Create a new Issue of an existing journal, and upload it's files to iDAI.publications/journals",
                "tags": [
                    "OJS",
                    "iDAI.publications/journals",
                    "publish",
                    "journal",
                    "pdf"
                ],
                "title": "Ingest a Journal-Issue to iDAI.publications/journals"
            },
            "schema": {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "additionalProperties": false,
                "definitions": {
                    "file_and_range": {
                        "additionalProperties": false,
                        "properties": {
                            "file": {
                                "type": "string"
                            },
                            "range": {
                                "items": {
                                    "type": "number"
                                },
                                "maxItems": 2,
                                "minItems": 2,
                                "type": "array"
                            }
                        },
                        "required": [
                            "file",
                            "range"
                        ],
                        "type": "object"
                    }
                },
                "description": "Used to validate ingest-journal job parameters",
                "properties": {
                    "do_nlp": {
                        "type": "boolean"
                    },
                    "do_ocr": {
                        "type": "boolean"
                    },
                    "files": {
                        "items": {
                            "$ref": "#/definitions/file_and_range"
                        },
                        "type": "array"
                    },
                    "keep_ratio": {
                        "type": "boolean"
                    },
                    "metadata": {
                        "additionalProperties": false,
                        "properties": {
                            "description": {
                                "type": "string"
                            },
                            "identification": {
                                "type": "string"
                            },
                            "importFilePath": {
                                "type": "string"
                            },
                            "number": {
                                "type": "string"
                            },
                            "volume": {
                                "type": "string"
                            },
                            "year": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "volume",
                            "year",
                            "number",
                            "description",
                            "importFilePath",
                            "identification"
                        ],
                        "type": "object"
                    },
                    "nlp_params": {
                        "additionalProperties": false,
                        "properties": {
                            "lang": {
                                "type": "string"
                            }
                        },
                        "type": "object"
                    },
                    "ocr_lang": {
                        "type": "string"
                    },
                    "ojs_metadata": {
                        "additionalProperties": false,
                        "properties": {
                            "allow_upload_without_file": {
                                "type": "boolean"
                            },
                            "auto_publish_issue": {
                                "type": "boolean"
                            },
                            "default_create_frontpage": {
                                "type": "boolean"
                            },
                            "default_publish_articles": {
                                "type": "boolean"
                            },
                            "ojs_journal_code": {
                                "type": "string"
                            },
                            "ojs_user": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "ojs_journal_code",
                            "ojs_user",
                            "auto_publish_issue",
                            "default_publish_articles",
                            "default_create_frontpage",
                            "allow_upload_without_file"
                        ],
                        "type": "object"
                    },
                    "parts": {
                        "items": {
                            "additionalProperties": false,
                            "properties": {
                                "files": {
                                    "items": {
                                        "$ref": "#/definitions/file_and_range"
                                    },
                                    "type": "array"
                                },
                                "metadata": {
                                    "additionalProperties": false,
                                    "properties": {
                                        "abstract": {
                                            "type": "string"
                                        },
                                        "author": {
                                            "items": {
                                                "additionalProperties": false,
                                                "properties": {
                                                    "firstname": {
                                                        "type": "string"
                                                    },
                                                    "lastname": {
                                                        "type": "string"
                                                    }
                                                },
                                                "required": [
                                                    "firstname",
                                                    "lastname"
                                                ],
                                                "type": "object"
                                            },
                                            "type": "array"
                                        },
                                        "auto_publish": {
                                            "type": "boolean"
                                        },
                                        "create_frontpage": {
                                            "type": "boolean"
                                        },
                                        "date_published": {
                                            "pattern": "[0-9]{4}-[0-9]{0,2}-[0-9]{0,2}$",
                                            "type": "string"
                                        },
                                        "language": {
                                            "pattern": "^[a-z]{2}_[A-Z]{2}$",
                                            "type": "string"
                                        },
                                        "pages": {
                                            "additionalProperties": false,
                                            "properties": {
                                                "endPrint": {
                                                    "type": "number"
                                                },
                                                "showndesc": {
                                                    "type": "string"
                                                },
                                                "startPrint": {
                                                    "type": "number"
                                                }
                                            },
                                            "required": [
                                                "showndesc",
                                                "startPrint",
                                                "endPrint"
                                            ],
                                            "type": "object"
                                        },
                                        "title": {
                                            "type": "string"
                                        },
                                        "zenonId": {
                                            "type": "string"
                                        }
                                    },
                                    "required": [
                                        "title",
                                        "author",
                                        "pages",
                                        "date_published",
                                        "language"
                                    ],
                                    "type": "object"
                                }
                            },
                            "required": [
                                "metadata",
                                "files"
                            ],
                            "type": "object"
                        },
                        "type": "array"
                    }
                },
                "required": [
                    "metadata",
                    "files"
                ],
                "title": "Ingest Journal schema",
                "type": "object"
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
                            "target_dir": "thumbnails",
                            "task": "convert.scale_image"
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
                            "task": "convert.scale_image"
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
    :query schema: (optional) if set to 'true', parameter schema is served

    :resheader Content-Type: application/json
    :>json dict: operation result
    :status 200: OK

    :return: YAML file content of the job type
    """
    try:
        with open(os.path.join(job_types_dir, job_type) + '.yml', 'r') as f:
            job_type_def = yaml.safe_load(f.read())

        schema_requested = request.args.get('schema')
        if schema_requested == 'true':
            schema_path = os.path.join(job_types_dir, 'schemas',
                                       job_type + '_schema.json')
            with open(schema_path, 'r') as schema_file:
                job_type_def['schema'] = yaml.safe_load(schema_file.read())

        return jsonify(job_type_def)
    except FileNotFoundError:
        raise ApiError(
            "job_type_not_found",
            f"No definition for given job type '{job_type}' found",
            404)
