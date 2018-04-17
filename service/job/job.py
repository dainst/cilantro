import uuid
import sys


def _generate_id():
    return str(uuid.uuid1())


class Job:

    def __init__(self, chain):
        self.chain = chain
        self.id = _generate_id()

    def run(self):
        self._set_job_id_for_tasks()
        return self.chain.apply_async(task_id=self.id)

    def _set_job_id_for_tasks(self):
        for task in self.chain.tasks:
            task.kwargs['job_id'] = self.id
