import os

from flask import Blueprint, jsonify, request, send_file, abort
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
                "contents": _list_dir(os.path.join(dir_path, entry.name))
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


@staging_controller.route(
    '/<path:path>',
    methods=['GET'],
    strict_slashes=False
)
def get_path(path):
    """
    Retrieve a file from the staging folder or lists the contents of a subfolder

    Returns HTTP status code 404 if file was not found

    Return A JSON array containing all file names, it it's a direcotry

    Returns the file's content if it's a file

    :param str path: path to file
    :return:
    """
    abs_path = os.path.join(staging_dir, path)
    if os.path.isdir(abs_path):
        return jsonify(os.listdir(abs_path))
    elif os.path.isfile(abs_path):
        return send_file(abs_path)
    else:
        abort(404)


@staging_controller.route('', methods=['POST'], strict_slashes=False)
def upload_to_staging():
    """
    Uploads files to the staging area.
    If the name of a posted file contains a directory-structure in it, represented structure will be created.

    The upload endpoint is able to handle single and multiple files provided
    under any key.

    Returns HTTP status code 400 if no files were provided.
    Returns HTTP status code 200 else

    :return: A JSON object with "content": The files and directories in the staging area.
            and with "warnings": The warnings if errors occured
    """
    warnings = []
    file_count = 0
    if request.files:
        for key in request.files:

            for file in request.files.getlist(key):
                file_count = file_count + 1
                if _is_allowed_file(file.filename):
                    try:
                        _upload_file(file)
                    except Exception as e:
                        warnings.append({"file_name": file.filename, "success": False, "warning": e.strerror,
                                         "warning_code": type(e).__name__})
                else:
                    warnings.append({"type": "file", "name": file.filename, "success": False,
                                     "warning": f"File extension .{_get_file_extension(file.filename)} is not allowed.",
                                     "warning_code": 415})

        return jsonify({"content": _list_dir(staging_dir), "warnings": warnings}), 200

    return jsonify({"content": _list_dir(staging_dir),
                    "warnings": [{"success": False, "warning": "No files provided", "warning_code": 400}]}), 400


def _upload_file(file):
    path = os.path.join(staging_dir, file.filename)
    if not os.path.exists(os.path.dirname(path)):
        os.makedirs(os.path.dirname(path))
    file.save(path)


def _is_allowed_file(filename):
    return '.' in filename and \
           _get_file_extension(filename) in allowed_extensions


def _get_file_extension(filename):
    return filename.rsplit('.', 1)[1].lower()
