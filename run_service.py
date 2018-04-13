#!/usr/bin/python
from flask import Flask

from service.front_controller import front
from service.job.job_controller import job

app = Flask('cilantro')
app.register_blueprint(front)
app.register_blueprint(job)
