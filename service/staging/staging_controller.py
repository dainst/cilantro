import os

from flask import Blueprint, jsonify, request, abort
from werkzeug.utils import secure_filename

staging_controller = Blueprint('staging', __name__)

staging_dir = os.environ['STAGING_DIR']

ALLOWED_EXTENSIONS = set(['xml', 'pdf', 'tif', 'tiff', 'json'])


@staging_controller.route('', methods=['GET'], strict_slashes=False)
def list_staging():
    """
    List files in the staging area
    :return list(str):
    """
    return jsonify(os.listdir(staging_dir))


@staging_controller.route('', methods=['POST'], strict_slashes=False)
def upload_to_staging():
    """
    Upload files to the staging area

    The upload endpoint is able to handle single files that were posted
    under the 'file' key as well as multiple files at once that have been
    posted under the 'files' key.
    :return dict:
    """
    if 'file' in request.files:
        file = request.files['file']
        if file and _allowed_file(file.filename):
            _upload_file(file)
            return jsonify({'success': True})
    elif 'files' in request.files:
        files = request.files.getlist("files")
        for file in files:
            if file and _allowed_file(file.filename):
                _upload_file(file)
        return jsonify({'success': True})
    return jsonify({'success': False}), 400


def _upload_file(file):
    filename = secure_filename(file.filename)
    file.save(os.path.join(staging_dir, filename))


def _allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


