import os

from flask import Blueprint, jsonify


repository_controller = Blueprint('repository', __name__)

repository_dir = os.environ['REPOSITORY_DIR']


@repository_controller.route('', methods=['GET'], strict_slashes=False)
def list_repository():
    return jsonify(os.listdir(repository_dir))
