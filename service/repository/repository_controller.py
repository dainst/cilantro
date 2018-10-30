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

    :return: JSON array containing objects for files and folders
    """
    return jsonify(os.listdir(repository_dir))


@repository_controller.route('/<path:path>', methods=['GET'],
                             strict_slashes=False)
def get_path(path):
    """
    Retrieve a file or folder content from the repository folder.

    Returns HTTP status code 404 if file was not found.

    Returns A JSON array containing all file names, if it's a directory.

    Returns the file's content if it's a file.

    :param str path: path to file
    """
    abs_path = os.path.join(repository_dir, path)
    if os.path.isdir(abs_path):
        return jsonify(os.listdir(abs_path))
    elif os.path.isfile(abs_path):
        return send_file(abs_path)
    else:
        raise ApiError("file_not_found",
                       f"No resource was found under the path {path}", 404)
