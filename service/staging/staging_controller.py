import os
import logging
import shutil
import zipfile
import json

from flask import Blueprint, jsonify, request, send_file
from werkzeug.utils import secure_filename

from service.errors import ApiError
from service.user.user_service import auth

from utils import cilantro_info_file

staging_controller = Blueprint('staging', __name__)

staging_dir = os.environ['STAGING_DIR']

allowed_extensions = ['pdf', 'tif', 'tiff', 'zip', 'txt']

log = logging.getLogger(__name__)


def _get_directory_structure(dir_path, depths=0):
    """
    Recursively creates a dictionary of the directory structure (files and subdirectories) for dir_path.

    Arguments:
    
    dir_path: string - The root directory that should be evaluated.

    depths: int - The recursion depths, if you provide a negative value, 
    the complete directory structure for dir_path is retrieved (default 0, 
    only listing top level contents).
    """
    tree = {}
    with os.scandir(dir_path) as it:
        for entry in sorted(it, key=lambda e: e.name):
            if entry.is_file():
                tree[entry.name] = {"type": "file", "name": entry.name}
            else:
                tree[entry.name] = {"type": "directory", "name": entry.name}
                if depths != 0:
                    path = os.path.join(dir_path, entry.name)

                    # handle directories with legacy .info file, existence implies successful import
                    if os.path.exists(os.path.join(path, ".info")):
                        tree[entry.name]["job_info"] = {"status": "success", "msg": cilantro_info_file.DEFAULT_SUCCESS_MESSAGE}
                    else:
                        tree[entry.name]["job_info"] = _parse_info_file(os.path.join(path, cilantro_info_file.FILE_NAME))
                    tree[entry.name]["contents"] = _get_directory_structure(path, depths-1)
    return tree

def _parse_info_file(path):
    if not os.path.exists(path):
        return None
    else:
        with open(path, 'r') as f:
            return json.load(f)

@staging_controller.route('', methods=['GET'], strict_slashes=False, defaults={'path': '.'})
@staging_controller.route('/<path:path>', methods=['GET'], strict_slashes=False)
@auth.login_required
def get_path(path):
    """
    Retrieve a file or folder content from the staging folder.

    Returns A JSON array containing all files, if it's a directory or
    the file's content if it's a file.

    .. :quickref: Staging Controller; Retrieve file/folder from staging folder

    **Example request**:

    .. sourcecode:: http

      GET /staging/<path>?depths=5 HTTP/1.1

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
    :param int depths: the directory stucture depths to reteive at `path` (default: 1, 
    returns direct subdirectories of path and their direct subdirectories.). If depths < 0 
    the complete subdirectory structure will be returned.

    :resheader Content-Type: application/json
    :status 200: array containing all file names, if it's a directory or the
                 file's content if it's a file
    :status 404: file was not found
    """
    depths = request.args.get('depths', 1, int)

    abs_path = _get_absolute_path(path)

    if os.path.isdir(abs_path):
        return jsonify(_get_directory_structure(abs_path, depths=depths))
    elif os.path.isfile(abs_path):
        return send_file(abs_path)
    else:
        raise ApiError("file_not_found",
                       f"No resource was found under the path {path}", 404)


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
    abs_path = _get_absolute_path(path)
    try:
        os.remove(abs_path)
    except (FileNotFoundError, IsADirectoryError):
        try:
            shutil.rmtree(abs_path)
        except FileNotFoundError:
            raise ApiError("file_not_found",
                           f"No resource was found under the path {path}", 404)

    return jsonify({"success": True}), 200



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
        os.makedirs(
            _get_absolute_path(folderpath),
            exist_ok=True
        )
        return jsonify({"success": True}), 200
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

    if 'target_folder' in request.form:
        target_folder = request.form['target_folder']
    else:
        target_folder = ""

    abs_path = _get_absolute_path(target_folder)

    if request.files:
        for key in request.files:
            for file in request.files.getlist(key):
                file.path = f"{abs_path}/{secure_filename(file.filename)}"
                results[file.path] = _process_file(file, auth.username())
        return jsonify({"result": results}), 200
    raise ApiError("no_files_provided",
                   f"The request did not contain any files")


@staging_controller.route('/move', methods=['POST'],
                          strict_slashes=False)
@auth.login_required
def move():
    """
    Move a file or folder inside the staging area.

    Folders inside the target path must already exist.

    Uses :py:func:~os.rename.

    .. :quickref: Staging Controller; Move files inside the staging area

    **Example request**:

    .. sourcecode:: http

      POST /staging/move HTTP/1.1

        {
            "source": "test-folder/file.txt",
            "target": "test-folder2/subfolder/"
        }

    **Example response SUCCESS**:

    .. sourcecode:: http

        HTTP/1.1 200 OK

        {
            "success": true
        }

    :reqheader Accept: application/json
    :<json string source: path of the file to be moved
    :<json string target: new path of the file to be moved

    :resheader Content-Type: application/json
    :>json dict: operation result
    :status 200: OK
    :return: A JSON object containing the status of the operation
    """
    if not request.data:
        raise ApiError("no_payload_found", "No request payload found")
    params = request.get_json(force=True)
    if 'source' not in params:
        raise ApiError("param_not found", "Missing source parameter")
    if 'target' not in params:
        raise ApiError("param_not found", "Missing target parameter")

    print(params['source'])
    print(params['target'])
    
    source = _get_absolute_path(params['source'])
    target = _get_absolute_path(params['target'])

    print(source)
    print(target)
    try:
        os.rename(source, target)
        return jsonify({"success": True}), 200
    except Exception as e:
        return _generate_error_result(
            source,
            "move_failed",
            "An unknown error occurred.",
            e)


def _process_file(file, username):
    if not _is_allowed_file_extension(file.filename):
        return _generate_error_result(
            file,
            "extension_not_allowed",
            f"File extension '{_get_file_extension(file.filename)}'"
            f" is not allowed.")
    elif _file_already_exists(file.path):
        return _generate_error_result(
            file,
            "file_already_exists",
            f"File already exists in folder.")
    else:
        try:
            _upload_file(file, username)
            if _get_file_extension(file.filename) == "zip":
                _unzip_file(file.path)
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
    directory_structure, filename = os.path.split(file.path)
    os.makedirs(directory_structure, exist_ok=True)
    file.save(file.path)


def _unzip_file(path):
    target_path = os.path.dirname(path)
    with zipfile.ZipFile(path, 'r') as zip_ref:
        zip_ref.extractall(target_path)
        os.remove(path)


def _file_already_exists(filename, target_dir):
    return os.path.exists(os.path.join(target_dir, secure_filename(filename)))


def _is_allowed_file_extension(filename):
    return _get_file_extension(filename) in allowed_extensions


def _get_file_extension(filename):
    if '.' not in filename:
        return ""
    else:
        return filename.rsplit('.', 1)[1].lower()

def _get_absolute_path(path):
    if auth.username() == "admin":
        return os.path.join(staging_dir, path)

    return os.path.join(staging_dir, auth.username(), path)
