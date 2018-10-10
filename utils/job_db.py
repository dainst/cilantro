import os
import datetime

from pymongo import MongoClient


client = MongoClient(os.environ['JOB_DB_URL'], int(os.environ['JOB_DB_PORT']))
db = client[os.environ['JOB_DB_NAME']]


def get_jobs_for_user(user):
    """
    Find all jobs of the passed user in the job database.

    :param str user: username to find jobs belonging to
    :return: list of job objects
    """
    job_list = []
    for job in db.jobs.find({"user": user}, {'_id': False}):
        job_list.append(job)
    return (job_list)


def add_job(job_id, user, job_type, task_ids):
    """
    Add a job to the job database.

    :param str job_id: Cilantro-ID of the job
    :param str user: username which started the job
    :param str job_type: type of job, i.e. 'ingest_journal'
    :param list task_ids: Cilantro-IDs of all tasks belonging to that job
    :return: None
    """
    timestamp = datetime.datetime.now()
    job = {'job_id': job_id,
           'user': user,
           'job_type': job_type,
           'task_ids': task_ids,
           'state': 'new',
           'created': timestamp,
           'updated': timestamp}

    db.jobs.insert_one(job)


def update_job(job_id, state):
    """
    Update a job to the job database with new state and updated timestamp.

    :param str job_id: Cilantro-ID of the job
    :param str state: new state of the job
    :return: None
    """
    timestamp = datetime.datetime.now()
    db.jobs.update_many({"job_id": job_id},
                        {'$set': {'state': state, 'updated': timestamp}})
