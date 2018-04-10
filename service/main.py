#!/usr/bin/python
from celery_client import celery
from flask import Flask, jsonify, url_for

app = Flask('cilantro')

@app.route('/')
def index():
    return 'cilantro is up and running ...'

@app.route('/task/create', methods=['POST'])
def task_create():
    task = celery.send_task('tasks.fake')
    print('Added task to queue.')
    return jsonify({'status': 'Accepted', 'task': task.id}),\
            202, {'Location': url_for('task_status', task_id=task.id)}

@app.route('/task/status/<task_id>')
def task_status(task_id):
    print('Stub implementation ...')

app.run(host='0.0.0.0')
