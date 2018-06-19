import os

from flask import Blueprint, jsonify, request, abort
from werkzeug.utils import secure_filename

staging_controller = Blueprint('staging', __name__)

staging_dir = os.environ['STAGING_DIR']

ALLOWED_EXTENSIONS = set(['xml', 'pdf', 'tif', 'json'])


@staging_controller.route('', methods=['GET'], strict_slashes=False)
def list_staging():
    return jsonify(os.listdir(staging_dir))


@staging_controller.route('', methods=['POST'], strict_slashes=False)
def upload_to_staging():
    if 'file' not in request.files:
        abort(400)
    files = request.files.getlist("file[]")
    for file in files:
        if file and _allowed_file(file.filename):
                _upload_file(file)
    return jsonify({'success': True}), 200


def _upload_file(file):
    filename = secure_filename(file.filename)
    file.save(os.path.join(staging_dir, filename))


def _allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


