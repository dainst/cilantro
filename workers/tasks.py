#!/usr/bin/python
import glob
import os
import shutil

from celery import signature, group

from celery_client import celery

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


@celery.task(bind=True)
def match(self, object_id, prev_task, pattern, run):
    source = os.path.join(working_dir, object_id, prev_task)
    subtasks = []
    for file in glob.iglob(os.path.join(source, pattern)):
        subtasks.append(signature("tasks.%s" % run, [object_id, prev_task, 'match', file]))
    raise self.replace(group(subtasks))


@celery.task
def convert(object_id, prev_task, parent_task, file):
    source = os.path.join(working_dir, object_id, prev_task)
    target = os.path.join(working_dir, object_id, parent_task)
    if not os.path.exists(target):
        try:
            os.makedirs(target)
        except:
            print("could not create dir, eating exception")
    new_file = file.replace('.tif','.jpg').replace(source, target)
    shutil.copyfile(file, new_file)


@celery.task
def publish(object_id, prev_task):
    source = os.path.join(working_dir, object_id, prev_task)
    target = os.path.join(repository_dir, object_id, 'publish')
    if os.path.exists(target):
        shutil.rmtree(target)
    shutil.copytree(source, target)
