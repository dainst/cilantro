#!/usr/bin/python
from celery_client import celery
import time

@celery.task
def fake():
    print('Received task. Faking workload ...')
    time.sleep(5)
    print ('Finished task.')
