#!/usr/bin/python
from celery_client import celery
import time
import os
import shutil
import glob

repository_dir = os.environ['REPOSITORY_DIR']
working_dir = os.environ['WORKING_DIR']

@celery.task
def retrieve(object_id):
    if not os.path.exists(repository_dir):
        shutil.mkdirs(repository_dir)
    if not os.path.exists(working_dir):
        shutil.mkdirs(working_dir)
    source = os.path.join(repository_dir, object_id, 'upload')
    target = os.path.join(working_dir, object_id, 'retrieve')
    if os.path.exists(target):
        shutil.rmtree(target)
    shutil.copytree(source, target)

# not working yet
@celery.task
def match(object_id, prev_task, pattern, run):
    source = os.path.join(working_dir, object_id, prev_task)
    for file in glob.iglob(os.path.join(source, pattern)):
        celery.send_task("tasks.%s" % run, {object_id: object_id, prev_task: prev_task, file_path: file})
        # TODO: group tasks and return when all are done

@celery.task
def convert(object_id, prev_task, file_path):
    new_file_path = file_path.replace('.tif','.jpg')
    shutil.copyfile(file_path, new_file_path)

@celery.task
def convert_folder(object_id, prev_task, pattern):
    source = os.path.join(working_dir, object_id, prev_task)
    target = os.path.join(working_dir, object_id, 'convert_folder')
    if not os.path.exists(target):
        os.makedirs(target)
    for file_path in glob.iglob(os.path.join(source, pattern)):
        new_file_path = file_path.replace('.tif','.jpg').replace(source, target)
        print("copying %s to %s" % (file_path, new_file_path))
        shutil.copyfile(file_path, new_file_path)

@celery.task
def publish(object_id, prev_task):
    source = os.path.join(working_dir, object_id, prev_task)
    target = os.path.join(repository_dir, object_id, 'publish')
    if os.path.exists(target):
        shutil.rmtree(target)
    shutil.copytree(source, target)
