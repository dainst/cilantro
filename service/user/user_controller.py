from flask import Blueprint, jsoninfy
from flask_httpauth import HTTPBasicAuth

auth = HTTPBasicAuth()

user_controller = Blueprint('staging', __name__)


@user_controller.route('/<user_name>', methods=['GET'])
@auth.login_required
def get_user(user_name):
    """
    Retrieves the user information for the given user name.

    This endpoint can also be used implement authentication since only logged in
    users are allowed to retrieve their user info.

    :return: JSON object representing the user
    """
    if auth.username == user_name:
        user = {"user_name": user_name}
        body = {"success": True, user: user}
        return jsoninfy(body)
    else:
        return jsoninfy({"success": False}), 403
