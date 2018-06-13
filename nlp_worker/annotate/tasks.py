import os
import json
import logging

from utils.celery_client import celery_app
from worker.tasks import BaseTask

from nlp_worker.annotate.annotate import annotate

log = logging.getLogger(__name__)


class AnnotateTask(BaseTask):

    name = "annotate"

    def execute_task(self):
        work_path = self.get_work_path(self.job_id)
        json_path = os.path.join(work_path, 'text.json')
        with open(json_path) as data_object:
            data = json.load(data_object)

        self.update_state(state='PROGRESS',
                          meta={'status': 'Running NLP analysis...'})
        result = annotate(data['text'], data['params'])
        log.info(result)


AnnotateTask = celery_app.register_task(AnnotateTask())
