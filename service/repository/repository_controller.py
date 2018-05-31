import os

from flask import Blueprint, jsonify, send_file, abort


repository_controller = Blueprint('repository', __name__)

repository_dir = os.environ['REPOSITORY_DIR']


@repository_controller.route('', methods=['GET'], strict_slashes=False)
def list_repository():
    return jsonify(os.listdir(repository_dir))


@repository_controller.route(
    '/<path:path>',
    methods=['GET'],
    strict_slashes=False
)
def get_path(path):
    abs_path = os.path.join(repository_dir, path)
    if os.path.isdir(abs_path):
        return jsonify(os.listdir(abs_path))
    elif os.path.isfile(abs_path):
        return send_file(abs_path)
    else:
        abort(404)
