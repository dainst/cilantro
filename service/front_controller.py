from flask import Blueprint

front_controller = Blueprint('front', __name__)


@front_controller.route('/')
def index():
    return "cilantro is up and running ..."
