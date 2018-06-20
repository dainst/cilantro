import os

from flask import Blueprint, jsonify, request, abort
from werkzeug.utils import secure_filename

staging_controller = Blueprint('staging', __name__)

staging_dir = os.environ['STAGING_DIR']

allowed_extensions = ['xml', 'pdf', 'tif', 'tiff', 'json']


@staging_controller.route('', methods=['GET'], strict_slashes=False)
def list_staging():
    """
    Lists files in the staging area.

    :return list(str):
    """
    return jsonify(os.listdir(staging_dir))


@staging_controller.route('', methods=['POST'], strict_slashes=False)
def upload_to_staging():
    """
    Uploads files to the staging area.

    The upload endpoint is able to handle single files that were posted
    under the 'file' key as well as multiple files at once that have been
    posted under the 'files' key.

    Returns HTTP status code 415 if one of the files' extension is not allowed.

    Returns HTTP status code 400 if neither 'file' nor 'files' contained valid
    file data.

    :return dict:
    """

    if 'file' in request.files:
        file = request.files['file']
        if file:
            if _is_allowed_file(file.filename):
                _upload_file(file)
                return jsonify({'success': True})
            else:
                return jsonify({'success': False}), 415

    elif 'files' in request.files:
        files = request.files.getlist("files")
        for file in files:
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


