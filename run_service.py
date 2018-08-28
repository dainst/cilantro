#!/usr/bin/env python3
import re

from flask import Flask, jsonify
from flask_cors import CORS
from werkzeug.exceptions import HTTPException

from utils.setup_logging import setup_logging
from service.front_controller import front_controller
from service.job.job_controller import job_controller
from service.job.job_type_controller import job_type_controller
from service.staging.staging_controller import staging_controller
from service.repository.repository_controller import repository_controller
from service.user.user_controller import user_controller
from service.errors import ApiError

setup_logging()

app = Flask('cilantro')
CORS(app, supports_credentials=True)

app.register_blueprint(front_controller)
app.register_blueprint(job_controller, url_prefix="/job")
app.register_blueprint(job_type_controller, url_prefix="/job_types")
app.register_blueprint(staging_controller, url_prefix="/staging")
app.register_blueprint(repository_controller, url_prefix="/repository")
app.register_blueprint(user_controller, url_prefix="/user")


@app.errorhandler(ApiError)
def handle_api_error(error):
    """
    Handle custom ApiErrors raised in controllers.

    This makes sure that a response object following a common JSON syntax
    is returned.

    :param ApiError error:
    :return dict: the response object
    """
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


@app.errorhandler(HTTPException)
def handle_http_exception(error):
    """
    Handle exceptions raised by flask internally.

    This makes sure that a response object following a common JSON syntax
    is returned.

    :param error:
    :return:
    """
    dic = {
        "success": False,
        "error": {
            "code": _to_snake_case(type(error).__name__),
            "message": str(error)
            }
        }
    response = jsonify(dic)
    response.status_code = error.code
    return response


def _to_snake_case(name):
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()
