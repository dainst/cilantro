import os

from flask import Blueprint, jsonify, request
from werkzeug.utils import secure_filename

staging_controller = Blueprint('staging', __name__)

staging_dir = os.environ['STAGING_DIR']

allowed_extensions = ['xml', 'pdf', 'tif', 'tiff', 'json']


def _list_dir(dir_path):
    tree = []
    for entry in os.scandir(dir_path):
        if entry.is_file():
            tree.append({
                "type": "file",
                "name": entry.name
            })
        else:
            tree.append({
                "type": "directory",
                "name": entry.name,
                "content": _list_dir(os.path.join(dir_path, entry.name))
            })
    return tree


@staging_controller.route('', methods=['GET'], strict_slashes=False)
def list_staging():
    """
    Lists files and directories in the staging area.

    Returns a complete recursive folder hierarchy.

    :return: JSON array containing objects for files and folders
    """

    tree = _list_dir(staging_dir)
    return jsonify(tree)


@staging_controller.route('', methods=['POST'], strict_slashes=False)
def upload_to_staging():
    """
    Uploads files to the staging area.

    The upload endpoint is able to handle single and multiple files provided
    under any key.

    Returns HTTP status code 415 if one of the files' extension is not allowed.

    Returns HTTP status code 400 if no files were provided.

    :return: A JSON object indicating success (e.g. "{ 'success': true }")
    """

    if request.files:
        for key in request.files:
            for file in request.files.getlist(key):
                if _is_allowed_file(file.filename):
                    _upload_file(file)
                else:
                    return jsonify({'success': False}), 415
        return jsonify({'success': True})

    return jsonify({'success': False}), 400


def _upload_file(file):
    filename = secure_filename(file.filename)
    file.save(os.path.join(staging_dir, filename))


def _is_allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions
