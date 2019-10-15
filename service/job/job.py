import uuid
import logging

from celery import chord, signature

from utils import job_db


class Job:
    """Wraps multiple celery task chains as a celery chord and handles ID generation."""

    def __init__(self, user, job_type, chains, params):
        """
        Create a job chord and triggers ID generation.

        :param List[chain] chains: A list of celery task chains
        """
        logger = logging.getLogger(__name__)

        self.id = str(uuid.uuid1())

        # Once all job chains have finished within this chord, we have to trigger a
        # callback worker in order to update the database entry for the chord job itself.
        self.chord = chord(chains, signature(
            'finish_chord', kwargs={'job_id': self.id, 'work_path': self.id}))

        self.chain_ids = []

        for current_chain in self.chord.tasks:
            current_chain_links = []
            current_chain_id = str(uuid.uuid1())
            current_work_path = current_chain_id
            current_chain.kwargs['work_path'] = current_work_path

            for single_task in current_chain.tasks:
                job_id = str(uuid.uuid1())

                single_task.kwargs['job_id'] = job_id
                single_task.options['task_id'] = job_id
                single_task.kwargs['work_path'] = current_work_path
                single_task.kwargs['parent_job_id'] = current_chain_id

                job_db.add_job(job_id=job_id,
                               user=user,
                               job_type=single_task.name,
                               parent_job_id=current_chain_id,
                               child_job_ids=[],
                               parameters=single_task.kwargs)

                current_chain_links += [job_id]

            job_db.add_job(job_id=current_chain_id,
                           user=user,
                           job_type='chain',
                           parent_job_id=self.id,
                           child_job_ids=current_chain_links,
                           parameters={'work_path': current_chain.kwargs['work_path']})
            self.chain_ids += [current_chain_id]

        job_db.add_job(job_id=self.id,
                       user=user,
                       job_type=job_type,
                       parent_job_id=None,
                       child_job_ids=self.chain_ids,
                       parameters=params)

        logger.info(f"created job chord with id: {self.id}: ")
        for (index, chain_id) in enumerate(self.chain_ids, 1):
            logger.info(
                f'  chain #{index}, job id: {chain_id}:')

    def run(self):
        """
        Trigger asynchronous execution of the job chord.

        :return AsyncResult: Celery result
        """
        job_db.update_job(self.id, 'started')
        for chain_id in self.chain_ids:
            job_db.update_job(chain_id, 'started')

        return self.chord.apply_async(task_id=self.id)
