#!/usr/bin/python
from flask import Flask
from utils.setup_logging import setup_logging
from service.front_controller import front_controller
from service.job.job_controller import job_controller
from service.staging.staging_controller import staging_controller

setup_logging()

app = Flask('cilantro')
app.register_blueprint(front_controller)
app.register_blueprint(job_controller, url_prefix="/job")
app.register_blueprint(staging_controller, url_prefix="/staging")
