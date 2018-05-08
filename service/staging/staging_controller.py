import os

from flask import Blueprint, jsonify


staging_controller = Blueprint('staging', __name__)

staging_dir = os.environ['STAGING_DIR']


@staging_controller.route('', methods=['GET'], strict_slashes=False)
def list_staging():
    return jsonify(os.listdir(staging_dir))
