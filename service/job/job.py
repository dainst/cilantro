import uuid


def _generate_id():
    return str(uuid.uuid1())


class Job:
    """
    Wraps a celery task chain and handles ID generation
    """

    def __init__(self, chain):
        """
        Creates a job and triggers ID generation
        :param Chain chain: A celery task chain
        """
        self.chain = chain
        self.id = _generate_id()

    def run(self):
        """
        Trigger asynchronous execution of the job chain
        :return AsyncResult: Celery result
        """
        self._set_job_id_for_tasks()
        return self.chain.apply_async(task_id=self.id)

    def _set_job_id_for_tasks(self):
        for task in self.chain.tasks:
            task.kwargs['job_id'] = self.id
