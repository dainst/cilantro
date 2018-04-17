import uuid
import sys


def _generate_id():
    return str(uuid.uuid1())


class Job:

    def __init__(self, chain):
        self._chain = chain
        self._id = _generate_id()

    def run(self):
        self._set_job_id_for_tasks()
        return self._chain.apply_async(task_id=self._id)

    def _set_job_id_for_tasks(self):
        for task in self._chain.tasks:
            task.kwargs['job_id'] = self._id
