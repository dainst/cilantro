import os

from flask import Blueprint, jsonify, send_file

from service.errors import ApiError

repository_controller = Blueprint('repository', __name__)

repository_dir = os.environ['REPOSITORY_DIR']


@repository_controller.route('', methods=['GET'], strict_slashes=False)
def list_repository():
    """
    List files and directories in the repository area.

    Returns a complete recursive folder hierarchy.

    .. :quickref: Repository Controller; \
        List files and directories in the repository area.

    **Example request**:

    .. sourcecode:: http

      GET /repository/ HTTP/1.1

    **Example response**:

    .. sourcecode:: http

        HTTP/1.1 200 OK

        [
            {
                "name": "test.pdf",
                "type": "file"
            }
        ]

    :reqheader Accept: application/json

    :resheader Content-Type: application/json
    :status 200: OK

    :return: JSON array containing objects for files and folders
    """
    return jsonify(os.listdir(repository_dir))


@repository_controller.route('/<path:path>', methods=['GET'],
                             strict_slashes=False)
def get_path(path):
    """
    Retrieve a file or folder content from the repository folder.

    Returns A JSON array containing all file names, if it's a directory or
    the file's content if it's a file.

    .. :quickref: Repository Controller; \
        Retrieve a file or folder content from the repository folder.

    **Example request**:

    .. sourcecode:: http

      GET /repository/<path> HTTP/1.1

    **Example response ERROR**:

    .. sourcecode:: http

        HTTP/1.1 404 NOT FOUND

        {
            "error": {
                "code": "file_not_found",
                "message": "No resource was found under the path test"
            },
            "success": false
        }

    :reqheader Accept: application/json
    :param str path: path to file

    :resheader Content-Type: application/json
    :status 200: array containing all file names, if it's a directory or the \
                 file's content if it's a file
    :status 404: file was not found
    """
    abs_path = os.path.join(repository_dir, path)
    if os.path.isdir(abs_path):
        return jsonify(os.listdir(abs_path))
    elif os.path.isfile(abs_path):
        return send_file(abs_path)
    else:
        raise ApiError("file_not_found",
                       f"No resource was found under the path {path}", 404)
