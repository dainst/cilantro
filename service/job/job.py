import uuid


def _generate_id():
    return str(uuid.uuid1())


class Job:
    """
    Wraps a celery task chain and handles ID generation.
    """

    def __init__(self, chain):
        """
        Create a job and triggers ID generation.

        :param Chain chain: A celery task chain
        """
        self.chain = chain
        self.id = _generate_id()

    def run(self):
        """
        Trigger asynchronous execution of the job chain.
        :return AsyncResult: Celery result
        """
        self._set_job_id_for_tasks()
        return self.chain.apply_async(task_id=self.id)

    def _set_job_id_for_tasks(self):
        # When there is only one element in the task chain, the tasks property
        # is not available.
        # In this case we just take the chain itself as a list as a workaround.
        if hasattr(self.chain, 'tasks'):
            task_chain = self.chain.tasks
        else:
            task_chain = [self.chain]

        for task in task_chain:
            task.kwargs['job_id'] = self.id
            # standard work_path for first level tasks is job_id
            task.kwargs['work_path'] = self.id
