#!/usr/bin/python
from celery import signature
from celery_client import celery
from flask import Flask, jsonify, url_for

app = Flask('cilantro')

@app.route('/')
def index():
    return 'cilantro is up and running ...'

@app.route('/task/create', methods=['POST'])
def task_create():
    chain = signature('tasks.retrieve', ['foo'], immutable=True)
    chain |= signature('tasks.match', ['foo', 'retrieve', '*.tif', 'convert'], immutable=True)
    chain |= signature('tasks.publish', ['foo', 'convert'], immutable=True)
    task = chain.apply_async()
    return jsonify({'status': 'Accepted', 'task': task.id}),\
            202, {'Location': url_for('task_status', task_id=task.id)}

@app.route('/task/status/<task_id>')
def task_status(task_id):
    task = celery.AsyncResult(task_id)
    response = {
        'status': task.state
    }
    if hasattr(task.info, 'result'):
        response['result'] = task.info['result']
    return jsonify(response)

app.run(host='0.0.0.0')
