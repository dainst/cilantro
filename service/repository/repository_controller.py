import os
import json
import logging
import yaml

from flask import Blueprint, jsonify, send_file, request, redirect

from service.errors import ApiError
from utils.repository import generate_repository_path, \
    list_objects_in_repository
from utils.list_dir import list_dir

repository_controller = Blueprint('repository', __name__)

repository_dir = os.environ['REPOSITORY_DIR']
metadata_file = 'meta.json'
representation_dir = 'data'
sub_object_dir = 'parts'

viewers_config = os.path.join(os.environ['CONFIG_DIR'], "viewers.yml")
with open(viewers_config, 'r', encoding="utf-8") as viewers_file:
    viewers = yaml.safe_load(viewers_file)

@repository_controller.route('', methods=['GET'], strict_slashes=False)
def list_repository():
    """
    List the ids of all cilantro objects in the repository.

    Returns a list of the object_ids

    .. :quickref: Repository Controller; List IDs of objects in the repository

    **Example request**:

    .. sourcecode:: http

      GET /repository/ HTTP/1.1

    **Example response**:

    .. sourcecode:: http

        HTTP/1.1 200 OK

        ["foo", "bar"]

    :reqheader Accept: application/json

    :resheader Content-Type: application/json
    :status 200: OK

    :return: JSON array containing the ids of all cilantro objects in the
        repository
    """
    return jsonify(list_objects_in_repository())


@repository_controller.route('/object/<path:object_id>', methods=['GET'],
                             strict_slashes=False)
def get_object(object_id):
    """
    Retrieve an cilantro (sub)object in the repository folder.

    Returns A JSON object containing metadata, representations and sub_objects
    of the cilantro object. This can be a subobject as well.

    .. :quickref: Repository Controller; Retrieve (sub)object in the repository

    **Example request**:

    .. sourcecode:: http

      GET /repository/object/<object_id> HTTP/1.1

    **Example response**:

    .. sourcecode:: http

        HTTP/1.1 200 OK

        {
            "metadata": {
                "description": "[PDFs teilweise verfugbar]",
                "identification": "year",
                "number": "",
                "ojs_id": "issue-test-188",
                "volume": "",
                "year": 2018
            },
            "representations": [
                "origin"
            ],
            "sub_objects": [
                "part_0001",
                "part_0002"
            ]
        }

    **Example response ERROR**:

    .. sourcecode:: http

        HTTP/1.1 404 NOT FOUND

        {
            "error": {
                "code": "object_not_found",
                "message": "No object with id test_object was found"
            },
            "success": false
        }

    :reqheader Accept: application/json
    :param str object_id: The id of the object

    :resheader Content-Type: application/json
    :status 200: OK
    :status 404: cilantro object was not found
    :return: JSON object containing metadata, representations and sub_objects
        of the cilantro (sub)object
    """
    path = os.path.join(repository_dir, generate_repository_path(object_id))
    if os.path.isdir(path):
        with open(os.path.join(path, metadata_file)) as json_data:
            metadata = json.load(json_data)
        representations = list_dir(os.path.join(path, representation_dir),
                                   sorted=True, ignore_not_found=True)
        sub_objects = list_dir(os.path.join(path, sub_object_dir), sorted=True,
                               ignore_not_found=True)
        return jsonify({
            'metadata': metadata,
            'representations': representations,
            'sub_objects': sub_objects})
    else:
        raise ApiError("object_not_found",
                       f"No object with id {object_id} was found", 404)


@repository_controller.route('/representation/<path:object_id>/<rep_name>',
                             methods=['GET'], strict_slashes=False)
def get_representation(object_id, rep_name):
    """
    Retrieve a representation of a cilantro (sub)object.

    Returns A JSON array containing all files of the representation.

    .. :quickref: Repository Controller; Retrieve a (sub)object representation

    **Example request**:

    .. sourcecode:: http

      GET /repository/representation/<object_id>/<rep_name> HTTP/1.1

    **Example response**:

    .. sourcecode:: http

        HTTP/1.1 200 OK

        [
          "merged.pdf"
        ]

    **Example response ERROR**:

    .. sourcecode:: http

        HTTP/1.1 404 NOT FOUND

        {
            "error": {
                "code": "representation_not_found",
                "message": "No representation jpg for object with id
                    test_object was found"
            },
            "success": false
        }

    :reqheader Accept: application/json
    :param str object_id: The id of the (sub) object
    :param str rep_name: The name of the representation

    :resheader Content-Type: application/json
    :status 200: OK
    :status 404: representation was not found
    :return: JSON array containing all files of the representation
    """
    path = os.path.join(repository_dir, generate_repository_path(object_id),
                        representation_dir, rep_name)
    if os.path.isdir(path):
        files = list_dir(path, sorted=True, ignore_not_found=True)
        return jsonify(files)
    else:
        raise ApiError("representation_not_found",
                       f"No representation {rep_name} for object with "
                       f"id {object_id} was found", 404)


@repository_controller.route(
    '/file/<path:object_id>/data/<path:rep_name>/<file>', methods=['GET'],
    strict_slashes=False)
def get_file(object_id, rep_name, file):
    """
    Retrieve a file from a representation of a cilantro (sub)object.

    Returns the file's content

    .. :quickref: Repository Controller; Retrieve a file from a representation

    **Example request**:

    .. sourcecode:: http

      GET /repository/file/<object_id>/data/<rep_name>/<file> HTTP/1.1

    Note that for sub-object the 'object_id' looks like:
    "<parent-object_id>/part_0001"

    **Example response ERROR**:

    .. sourcecode:: http

        HTTP/1.1 404 NOT FOUND

        {
            "error": {
                "code": "file_not_found",
                "message": "No file test_file.jpg was found in representation
                    jpg of object test_object"
            },
            "success": false
        }

    :reqheader Accept: *
    :param str object_id: The id of the object
    :param str rep_name: The name of the representation
    :param str file: The name of the file

    :resheader Content-Type: *
    :status 200: OK
    :status 404: file was not found
    :return: Downloadable file
    """
    path = os.path.join(repository_dir, generate_repository_path(object_id),
                        representation_dir, rep_name, file)
    if os.path.isfile(path):
        return handle_file_request(path)
    else:
        raise ApiError("file_not_found",
                       f"No file {file} was found in representation {rep_name}"
                       f" of object {object_id}", 404)


@repository_controller.route('/file/<path:object_id>/<file>',
                             methods=['GET'], strict_slashes=False)
def get_meta_file(object_id, file):
    """
    Retrieve a file from the root of a cilantro (sub)object.

    Returns the file's content. Files on root level are normally metdata files.

    .. :quickref: Repository Controller; Retrieve metadatafile of (sub)object

    **Example request**:

    .. sourcecode:: http

      GET /repository/file/<object_id>/<file> HTTP/1.1

    **Example response ERROR**:

    .. sourcecode:: http

        HTTP/1.1 404 NOT FOUND

        {
            "error": {
                "code": "file_not_found",
                "message": "No file test_file.jpg was found in object
                    test_object"
            },
            "success": false
        }

    :reqheader Accept: application/json
    :param str object_id: The id of the object
    :param str file: Name of the file

    :resheader Content-Type: application/json
    :status 200: OK
    :status 404: file was not found
    :return: Downloadable file
    """
    path = os.path.join(repository_dir, generate_repository_path(object_id),
                        file)
    if os.path.isfile(path):
        return send_file(path)
    else:
        raise ApiError("file_not_found",
                       f"No file {file} was found in object {object_id}", 404)


def handle_file_request(path):
    if request.headers.get('Accept') == '*/*':
        return send_file(path)
    elif request.accept_mimetypes.accept_html:
        ext = os.path.splitext(path)[1][1:]
        if ext in viewers:
            url = viewers[ext] + path[len(repository_dir):]
            return redirect(url, code=303)
    return send_file(path)
