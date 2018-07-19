import os
import logging

from flask import Blueprint, jsonify, request, send_file, abort
from werkzeug.utils import secure_filename
from service.user.user_service import auth

staging_controller = Blueprint('staging', __name__)

staging_dir = os.environ['STAGING_DIR']

allowed_extensions = ['xml', 'pdf', 'tif', 'tiff', 'json']

logger = logging.getLogger(__name__)


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
@auth.login_required
def list_staging():
    """
    List files and directories in the staging area.

    Returns a complete recursive folder hierarchy.

    :return: JSON array containing objects for files and folders
    """

    tree = _list_dir(os.path.join(staging_dir, auth.username()))
    return jsonify(tree)


@staging_controller.route(
    '/<path:path>',
    methods=['GET'],
    strict_slashes=False
)
@auth.login_required
def get_path(path):
    """
    Retrieve a file from the staging folder or lists the contents of a subfolder

    Returns HTTP status code 404 if file was not found

    Return A JSON array containing all file names, it it's a direcotry

    Returns the file's content if it's a file

    :param str path: path to file
    :return:
    """
    abs_path = os.path.join(staging_dir, auth.username(), path)
    if os.path.isdir(abs_path):
        return jsonify(os.listdir(abs_path))
    elif os.path.isfile(abs_path):
        return send_file(abs_path)
    else:
        abort(404)


@staging_controller.route('', methods=['POST'], strict_slashes=False)
@auth.login_required
def upload_to_staging():
    """
    Uploads files to the staging area.

    If the names of the given files contain folders these are created in the
    staging area if they are not already present.

    The upload endpoint is able to handle single and multiple files provided
    under any key.

    Returns HTTP status code 415 if one of the files' extension is not allowed.

    Returns HTTP status code 400 if no files were provided.
    Returns HTTP status code 200 else

    :return: A JSON object with format:

        {
            "result": {
                <uploaded_file_name>: {
                    "success": <boolean>,
                    "error": {
                        "code": <string>,
                        "message": <string>
                    }
                }
            }
        }

    """

    logger.debug(f"Uploading {len(request.files)} files")
    results = {}

    if request.files:
        for key in request.files:
            for file in request.files.getlist(key):
                results[file.filename] = _process_file(file)
        return jsonify({"result": results}), 200
    return "No files provided", 400


def _process_file(file):
    if _is_allowed_file(file.filename):
        try:
            _upload_file(file)
            return {"success": True}
        except Exception as e:
            return _generate_error_result(
                file,
                "upload_failed",
                "An unknown error occurred.",
                e
            )
    else:
        return _generate_error_result(
            file,
            "extension_not_allowed",
            f"File extension .{_get_file_extension(file.filename)}"
            f" is not allowed."
        )
    return result


def _generate_error_result(file, code, message, e=None):
    logger.error(f"Error during upload of {file.filename}. {message}.")
    if e:
        logger.error(f" Cause: {str(e)}")
    return {
        "success": False,
        "error": {
            "code": code,
            "message": message
        }
    }


def _upload_file(file):
    path, filename = os.path.split(file.filename)
    folders = list(map(secure_filename, path.split("/")))
    full_path = os.path.join(staging_dir, *folders)
    os.makedirs(full_path, exist_ok=True)
    file.save(os.path.join(full_path, secure_filename(filename)))


def _is_allowed_file(filename):
    return '.' in filename and \
           _get_file_extension(filename) in allowed_extensions


def _get_file_extension(filename):
    return filename.rsplit('.', 1)[1].lower()
