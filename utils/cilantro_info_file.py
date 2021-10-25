import os
import json


FILE_NAME = '.cilantro_info'
DEFAULT_SUCCESS_MESSAGE = 'No further success information provided'

def write_success(directory, msg):

  if msg is None:
    msg = DEFAULT_SUCCESS_MESSAGE

  path = os.path.join(directory, FILE_NAME)
  with open(path, 'w') as f:
      content = {
          'status': 'success',
          'msg': msg
      }

      json.dump(content, f)

def write_success_with_link(directory, msg, url, url_label):
    
  if msg is None:
    msg = DEFAULT_SUCCESS_MESSAGE

  path = os.path.join(directory, FILE_NAME)
  with open(path, 'w') as f:
      content = {
          'status': 'success',
          'msg': msg,
          'url': url,
          'url_label': url_label
      }

      json.dump(content, f)

def write_error(directory, job_id, error):
  path = os.path.join(directory, FILE_NAME)
  with open(path, 'w') as f:
      content = {
          'status': 'error',
          'msg': error,
          'job_id': job_id
      }

      json.dump(content, f)


def write_processing_started(directory, job_id):
  path = os.path.join(directory, FILE_NAME)
  with open(path, 'w') as f:
      content = {
          'status': 'started',
          'msg': job_id
      }

      json.dump(content, f)