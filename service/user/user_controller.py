from flask import Blueprint, jsonify
from service.user.user_service import auth

user_controller = Blueprint('user', __name__)


@user_controller.route('/<user_name>', methods=['GET'])
@auth.login_required
def get_user(user_name):
    r"""
    Retrieve the user information for the given user name.

    This endpoint can also be used implement authentication since only logged
    in users are allowed to retrieve their user info.

    .. :quickref: User Controller; \
        Retrieve the user information for the given user name.

    **Example request**:

    .. sourcecode:: http

      GET /user/<username> HTTP/1.1

    **Example response**:

    .. sourcecode:: http

      HTTP/1.1 200 OK

      TODO

    :reqheader Accept: application/json
    :param str user_name: name of the user

    :resheader Content-Type: application/json
    :>json dict: operation result
    :status 200: OK

    :return: JSON object representing the user
    """
    if auth.username() == user_name:
        user = {"user_name": user_name}
        body = {"success": True, "user": user}
        return jsonify(body)
    else:
        return jsonify({"success": False}), 403
