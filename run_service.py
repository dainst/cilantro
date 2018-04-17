#!/usr/bin/python
from flask import Flask

from service.front_controller import front_controller
from service.job.job_controller import job_controller

app = Flask('cilantro')
app.register_blueprint(front_controller)
app.register_blueprint(job_controller)
