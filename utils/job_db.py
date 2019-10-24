import os
import datetime

from pymongo import MongoClient, DESCENDING

client = MongoClient(os.environ['JOB_DB_URL'], int(os.environ['JOB_DB_PORT']))
db = client[os.environ['JOB_DB_NAME']]


def create_index():
    """
    Create index for faster lookup in database.

    The 2 fields that are used for lookup/update are indexed.
    """
    db.jobs.create_index([("job_id", DESCENDING),
                          ("user", DESCENDING)])


def get_jobs_for_user(user):
    """
    Find all jobs of the passed user in the job database.

    :param str user: username to find jobs belonging to
    :return: list of job objects
    """
    job_list = []
    for job in db.jobs.find({"user": user, "parent_job_id": None}, {'_id': False}):
        job_list.append(
            expand_child_information(job)
        )
    return job_list


def get_job_by_id(job_id):
    """
    Find job with the given job_id.

    :param str job_id: job-id to be queried
    :return: job object
    """
    job = expand_child_information(db.jobs.find_one(
        {"job_id": job_id}, {'_id': False}))
    return job


def expand_child_information(job):
    """
    Expand child job information for parent job
    :param job: Parent job to be expanded
    :return: job object
    """
    if 'child_job_ids' in job:
        children_with_status = []
        for child_id in job['child_job_ids']:
            child = db.jobs.find_one({'job_id': child_id}, {'_id': False})
            children_with_status += [{'job_id': child_id,
                                      'state': child['state'],
                                      'type': child['job_type']}]

        del job['child_job_ids']

        job['children'] = children_with_status

    if 'parent_job_id' in job and job['parent_job_id'] == None:
        del job['parent_job_id']
    return job


def add_job(job_id, user, job_type, parent_job_id, child_job_ids, parameters):
    """
    Add a job to the job database.

    :param str job_id: Cilantro-ID of the job
    :param str user: username which started the job
    :param str job_type: type of job, i.e. 'ingest_journal'
    :param list task_ids: Cilantro-IDs of all tasks belonging to that job
    :param dict parameters: Issue parameters
    :return: None
    """
    timestamp = datetime.datetime.now()
    job = {'job_id': job_id,
           'user': user,
           'job_type': job_type,
           'name': f"{job_type}-{job_id}",
           'parent_job_id': parent_job_id,
           'child_job_ids': child_job_ids,
           'state': 'new',
           'created': timestamp,
           'started': None,
           'updated': timestamp,
           'parameters': parameters,
           'errors': []
           }

    db.jobs.insert_one(job)


def update_job_state(job_id, state, error=None):
    """
    Update a job to the job database with new state and updated timestamp.

    If there is an error object passed then that is added to the list
    of errors of that task. The errors are a list to  make it
    possible to keep executing the task chain even though some tasks
    throw errors. The errors are put into the job entry in the database
    and can be collected later.

    :param str job_id: Cilantro-ID of the job
    :param str state: new state of the job
    :param dict error: (optional) dict containig task name and error message
    :return: None
    """
    timestamp = datetime.datetime.now()

    updated_values = {'state': state, 'updated': timestamp}

    if state == 'started':
        updated_values['started'] = timestamp

    db.jobs.update_many({"job_id": job_id},
                        {'$set': updated_values})
    if error:
        db.jobs.update_many({"job_id": job_id},
                            {'$push': {'errors': error}})


def set_job_children(job_id, child_job_ids):

    timestamp = datetime.datetime.now()

    updated_values = {'child_job_ids': child_job_ids, 'updated': timestamp}
    db.jobs.update_many({"job_id": job_id},
                        {'$set': updated_values})


def add_job_error(job_id, error_message):

    timestamp = datetime.datetime.now()
    db.jobs.update_many({"job_id": job_id},
                        {'$push': {'errors': error_message}, '$set': {'updated': timestamp}})
