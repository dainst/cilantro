import os
import logging
import shutil

from flask import Blueprint, jsonify, request, send_file
from werkzeug.utils import secure_filename

from service.errors import ApiError
from service.user.user_service import auth

staging_controller = Blueprint('staging', __name__)

staging_dir = os.environ['STAGING_DIR']

allowed_extensions = ['xml', 'pdf', 'tif', 'tiff', 'json', 'csv']

log = logging.getLogger(__name__)


def _list_dir(dir_path):
    tree = []
    for entry in sorted(os.scandir(dir_path), key=lambda e: e.name):
        if entry.is_file():
            tree.append({
                "type": "file",
                "name": entry.name})
        else:
            tree.append({
                "type": "directory",
                "name": entry.name,
                "contents": _list_dir(os.path.join(dir_path, entry.name))})
    return tree


@staging_controller.route('/<path:path>', methods=['DELETE'],
                          strict_slashes=False)
@auth.login_required
def delete_from_staging(path):
    """
    Delete file or directory from the staging area.

    .. :quickref: Staging Controller; Delete file or dir from the staging area

    **Example request**:

    .. sourcecode:: http

      DELETE /staging/<path> HTTP/1.1

    **Example response SUCCESS**:

    .. sourcecode:: http

        HTTP/1.1 200 OK

            {
                "success": true
            }

    **Example response ERROR**:

    .. sourcecode:: http

        HTTP/1.1 404 NOT FOUND

            {
                "error": {
                    "code": "file_not_found",
                    "message": "No resource was found under the path <path>"
                },
                "success": false
            }

    :reqheader Accept: application/json
    :resheader Content-Type: application/json
    :param str path: path to file or directory to be deleted
    """
    try:
        os.remove(os.path.join(staging_dir, auth.username(), path))
    except (FileNotFoundError, IsADirectoryError):
        try:
            shutil.rmtree(os.path.join(staging_dir, auth.username(), path))
        except FileNotFoundError:
            raise ApiError("file_not_found",
                           f"No resource was found under the path {path}", 404)

    return jsonify({"success": True}), 200


@staging_controller.route('', methods=['GET'], strict_slashes=False)
@auth.login_required
def list_staging():
    """
    List files and directories in the staging area.

    Returns a complete recursive folder hierarchy.

    .. :quickref: Staging Controller; List files/dirs in the staging area

    **Example request**:

    .. sourcecode:: http

      GET /staging/ HTTP/1.1

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
    try:
        tree = _list_dir(os.path.join(staging_dir, auth.username()))
    except FileNotFoundError:
        log.warning(f"List staging called on not-existing folder: "
                    f"{os.path.join(staging_dir, auth.username())}")
        tree = []
    return jsonify(tree)


@staging_controller.route('/<path:path>', methods=['GET'],
                          strict_slashes=False)
@auth.login_required
def get_path(path):
    """
    Retrieve a file or folder content from the staging folder.

    Returns A JSON array containing all file names, if it's a directory or
    the file's content if it's a file.

    .. :quickref: Staging Controller; Retrieve file/folder from staging folder

    **Example request**:

    .. sourcecode:: http

      GET /staging/<path> HTTP/1.1

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
    :status 200: array containing all file names, if it's a directory or the
                 file's content if it's a file
    :status 404: file was not found
    """
    abs_path = os.path.join(staging_dir, auth.username(), path)
    if os.path.isdir(abs_path):
        return jsonify(os.listdir(abs_path))
    elif os.path.isfile(abs_path):
        return send_file(abs_path)
    else:
        raise ApiError("file_not_found",
                       f"No resource was found under the path {path}", 404)


@staging_controller.route('/folder', methods=['POST'],
                          strict_slashes=False)
@auth.login_required
def create_folder():
    """
    Create folders in the staging area.

    Can be passed folders with subfolders separated by slashes.

    .. :quickref: Staging Controller; Upload files to the staging area

    **Example request**:

    .. sourcecode:: http

      POST /staging/folder HTTP/1.1

        {
            "folderpath": "test-folder/subfolder"
        }

    **Example response SUCCESS**:

    .. sourcecode:: http

        HTTP/1.1 200 OK

        {
            "success": true
        }

    :reqheader Accept: application/json
    :<json string folderpath: folders to be created

    :resheader Content-Type: application/json
    :>json dict: operation result
    :status 200: OK
    :return: A JSON object containing the status of the operation
    """
    if not request.data:
        raise ApiError("no_payload_found", "No request payload found")
    params = request.get_json(force=True)
    if not params['folderpath']:
        raise ApiError("param_not found", "Missing folderpath parameter")
    folderpath = params['folderpath']
    try:
        os.makedirs(os.path.join(staging_dir, auth.username(), folderpath),
                    exist_ok=True)
        return {"success": True}
    except Exception as e:
        return _generate_error_result(
            folderpath,
            "folder_creation_failed",
            "An unknown error occurred.",
            e)


@staging_controller.route('', methods=['POST'], strict_slashes=False)
@auth.login_required
def upload_to_staging():
    """
    Upload files to the staging area.

    If the names of the given files contain folders, these are created in the
    staging area if not already present.

    Alternatively you can pass an extra argument 'target_folder' which is
    prepended to all passed file names.

    The upload endpoint is able to handle single and multiple files provided
    under any key.

    .. :quickref: Staging Controller; Upload files to the staging area

    **Example request**:

    .. sourcecode:: http

      POST /staging/ HTTP/1.1

    **Example response SUCCESS**:

    .. sourcecode:: http

        HTTP/1.1 200 OK

        {
          "result": {
              "<filename>": {
                  "success": true
              }
          }
        }

    **Example response ERROR**:

    .. sourcecode:: http

        HTTP/1.1 400 BAD REQUEST

        {
          "error": {
              "code": "no_files_provided",
              "message": "The request did not contain any files"
          },
          "success": false
        }

    :reqheader Accept: multipart/form-data
    :formparam file: file to be uploaded
    :formparam target_folder: (optional) target folder for all files

    :resheader Content-Type: application/json
    :>json dict: operation result
    :status 200: OK
    :status 400: no files were provided
    :status 415: one of the files' extension is not allowed

    :return: a JSON object
    """
    log.debug(f"Uploading {len(request.files)} files")
    results = {}

    is_target_folder_param_present = 'target_folder' in request.form
    print(is_target_folder_param_present)
    if (is_target_folder_param_present):
        target_folder = request.form['target_folder']

    if request.files:
        for key in request.files:
            for file in request.files.getlist(key):
                if (is_target_folder_param_present):
                    file.filename = f"{target_folder}/{file.filename}"
                results[file.filename] = _process_file(file, auth.username())
        return jsonify({"result": results}), 200
    raise ApiError("no_files_provided",
                   f"The request did not contain any files")


def _process_file(file, username):
    if not _is_allowed_file_extension(file.filename):
        return _generate_error_result(
            file,
            "extension_not_allowed",
            f"File extension '{_get_file_extension(file.filename)}'"
            f" is not allowed.")
    elif _file_already_exists(file.filename,
                              os.path.join(staging_dir, username)):
        return _generate_error_result(
            file,
            "file_already_exists",
            f"File already exists in folder.")
    else:
        try:
            _upload_file(file, username)
            return {"success": True}
        except Exception as e:
            return _generate_error_result(
                file,
                "upload_failed",
                "An unknown error occurred.",
                e)


def _generate_error_result(file, code, message, e=None):
    log.error(f"Error during upload of {file.filename}. {message}.")
    if e:
        log.error(f" Cause: {str(e)}")
    return {
        "success": False,
        "error": {
            "code": code,
            "message": message}
        }


def _upload_file(file, username):
    path, filename = os.path.split(file.filename)
    folders = list(map(secure_filename, path.split("/")))
    full_path = os.path.join(staging_dir, username, *folders)
    os.makedirs(full_path, exist_ok=True)
    file.save(os.path.join(full_path, secure_filename(filename)))


def _file_already_exists(filename, target_dir):
    return os.path.exists(os.path.join(target_dir, secure_filename(filename)))


def _is_allowed_file_extension(filename):
    return _get_file_extension(filename) in allowed_extensions


def _get_file_extension(filename):
    if '.' not in filename:
        return ""
    else:
        return filename.rsplit('.', 1)[1].lower()
