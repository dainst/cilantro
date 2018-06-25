#!/usr/bin/env python3
from flask import Flask
from flask_cors import CORS

from utils.setup_logging import setup_logging
from service.front_controller import front_controller
from service.job.job_controller import job_controller
from service.job.job_type_controller import job_type_controller
from service.staging.staging_controller import staging_controller
from service.repository.repository_controller import repository_controller

setup_logging()

app = Flask('cilantro')
CORS(app)

app.register_blueprint(front_controller)
app.register_blueprint(job_controller, url_prefix="/job")
app.register_blueprint(job_type_controller, url_prefix="/job_types")
app.register_blueprint(staging_controller, url_prefix="/staging")
app.register_blueprint(repository_controller, url_prefix="/repository")
