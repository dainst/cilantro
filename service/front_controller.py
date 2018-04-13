from flask import Blueprint

front = Blueprint('front', __name__)


@front.route('/')
def index():
    return 'cilantro is up and running ...'
