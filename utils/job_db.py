import os
import datetime

from pymongo import MongoClient, DESCENDING, ReturnDocument
from pymongo.errors import DuplicateKeyError


class JobDb:

    job_db_url = os.environ['JOB_DB_URL']
    job_db_port = int(os.environ['JOB_DB_PORT'])
    job_db_name = os.environ['JOB_DB_NAME']
    first_object_id = int(os.environ['FIRST_OBJECT_ID'])

    def __init__(self):
        self.db = self._get_db_client()

    def __del__(self):
        self.close()  # pymongo doesn't complain if this was closed already

    def close(self):
        """
        Cleanup resources, end server sessions and disconnect from the mongo db.

        (Note that the job-db is still usable after this is called, since its
        client will reconnect automatically.)
        """
        self.db.client.close()

    def start_db(self):
        self._create_index()
        self._set_first_object_id()

    def get_next_unique_object_id_suffix(self):
        """
        Create the last part of the object identifier (a unique integer).

        :return: int
        """
        try:
            # The document holding the ids is initially set up via start_db()
            return  self.db.objects.find_one_and_update(
                { '_id': 'object_ids'},
                {'$inc': {'next': 1}},
                projection={'_id': False, 'next': True},
                return_document=ReturnDocument.AFTER
            )['next']
        except (KeyError, TypeError):
            raise RuntimeError(
                "Could not get object id. Is the job-db up and initialized?"
            )

    def get_jobs_for_user(self, user):
        """
        Find all jobs of the passed user in the job database.

        :param str user: username to find jobs belonging to
        :return: list of job objects
        """
        job_list = []
        for job in self.db.jobs.find({"user": user, "parent_job_id": None, "archived":False}, {'_id': False}):
            job_list.append(
                self._expand_child_information(job)
            )
        return job_list

    def get_job_by_id(self, job_id):
        """
        Find job with the given job_id.

        :param str job_id: job-id to be queried
        :return: job object
        """
        job = self.db.jobs.find_one({"job_id": job_id}, {'_id': False})
        if job is not None:
           self._expand_child_information(job)
        return job

    def add_job(self, job_id, user, job_type, parent_job_id, child_job_ids, parameters, label="Not implemented", description="Not implemented",):
        """
        Add a job to the job database.

        :param str job_id: Cilantro-ID of the job
        :param str user: username which started the job
        :param str job_type: type of job, i.e. 'ingest_journals'
        :param str parent_job_id: Cilantro-IDs of the parent job
        :param list child_job_ids: Cilantro-IDs of the child jobs
        :param dict parameters: Issue parameters
        :return: None
        """
        timestamp = datetime.datetime.now()
        job = {'job_id': job_id,
            'user': user,
            'job_type': job_type,
            'name': f"{job_type}-{job_id}",
            'label': label,
            'description': description,
            'parent_job_id': parent_job_id,
            'child_job_ids': child_job_ids,
            'state': 'new',
            'archived': False,
            'created': timestamp,
            'started': None,
            'updated': timestamp,
            'parameters': parameters,
            'errors': [],
            'log': []
            }

        self.db.jobs.insert_one(job)

    def update_job_state(self, job_id, state, error=None):
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
        self.db.jobs.update_many({"job_id": job_id},
                                 {'$set': updated_values})
        if error:
            self.db.jobs.update_many({"job_id": job_id},
                                     {'$push': {'errors': error}})

    def archive_jobs(self, job_ids):
        """
        Archives a list of jobs in the job database with archived flag to true.
        :param [str] job_ids: List of Cilantro-ID of the job
        :return: None
        """
        updated_values = {'archived': True}
        self.db.jobs.update_many({"job_id": {"$in":job_ids}},
                                 {'$set': updated_values})

    def update_job_log(self, job_id, log_output):
        """
        Updates (replaces) the log for the specified job.

        :param str job_id: Cilantro-ID of the job
        :param list log_output: List of logged lines
        """
        timestamp = datetime.datetime.now()
        self.db.jobs.update_many({"job_id": job_id},
                                  {'$set': {'updated': timestamp, 'log': log_output}})


    def set_job_children(self, job_id, child_job_ids):
        timestamp = datetime.datetime.now()
        updated_values = {'child_job_ids': child_job_ids, 'updated': timestamp}
        self.db.jobs.update_many({"job_id": job_id},
                            {'$set': updated_values})

    def set_job_label_and_description(self, job_id, label, description):
        timestamp = datetime.datetime.now()
        updated_values = {'label': label, 'description': description, 'updated': timestamp}
        self.db.jobs.update_many({"job_id": job_id},
                            {'$set': updated_values})

    def set_job_object_id(self, job_id, object_id):
        timestamp = datetime.datetime.now()
        updated_values = {'object_id': object_id, 'updated': timestamp}
        self.db.jobs.update_many({"job_id": job_id},
                            {'$set': updated_values})

    def add_job_error(self, job_id, error_message):
        timestamp = datetime.datetime.now()
        self.db.jobs.update_many({"job_id": job_id},
                            {'$push': {'errors': error_message}, '$set': {'updated': timestamp}})

    def _create_index(self):
        """
        Create index for faster lookup in database.
        The 2 fields that are used for lookup/update are indexed.
        Note that index creation in mongo is idempotent, so this can be called multiple times.
        """
        self.db.jobs.create_index([("job_id", DESCENDING), ("user", DESCENDING)])

    def _set_first_object_id(self):
        try:
            self.db.objects.insert_one({'_id': 'object_ids', 'next': self.first_object_id})
        except DuplicateKeyError:
            pass  # we expect the document to already exist


    def _get_db_client(self):
        return MongoClient(self.job_db_url, self.job_db_port)[self.job_db_name]

    def _expand_child_information(self, job):
        """
        Expand child job information for parent job
        :param job: Parent job to be expanded
        :return: job object
        """
        if 'child_job_ids' in job:
            children_with_status = []
            for child_id in job['child_job_ids']:
                child = self.db.jobs.find_one({'job_id': child_id}, {'_id': False})
                children_with_status += [{'job_id': child_id,
                                        'state': child['state'],
                                        'label': child['label']}]

            del job['child_job_ids']
            job['children'] = children_with_status

        if 'parent_job_id' in job and job['parent_job_id'] is None:
            del job['parent_job_id']
        return job
