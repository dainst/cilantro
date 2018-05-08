#!/usr/bin/python
from flask import Flask
from utils.logging import setup_logging
from service.front_controller import front_controller
from service.job.job_controller import job_controller

setup_logging()

app = Flask('cilantro')
app.register_blueprint(front_controller)
app.register_blueprint(job_controller)
