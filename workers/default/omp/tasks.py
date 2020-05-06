import os
import logging
from utils.celery_client import celery_app

from workers.base_task import ObjectTask
from workers.default.omp.omp_api import publish

log = logging.getLogger(__name__)


def _generate_omp_id(prefix, journal_code, result_id):
    return f"{prefix}-{journal_code}-{result_id}"


class PublishToOMPTask(ObjectTask):
    """
    Publish documents in the XML in the working directory via OMP-Plugin.

    Preconditions:
    -omp_import.xml in the working dir
    """

    name = "publish_to_omp"

    def process_object(self, obj):
        work_path = self.get_work_path()
        omp_press_code = self.get_param('omp_press_code')

        _, result = publish(os.path.join(work_path, 'omp_import.xml'),
                            omp_press_code)

        if not result['success']:
            raise RuntimeError(result)

        if len(result['warnings']) > 0:
            raise RuntimeError(result['warnings'])
        else:
            omp_id = _generate_omp_id('monograph',
                                      omp_press_code,
                                      result['published_monographs'][0])
            obj.metadata['omp_id'] = omp_id
            obj.write()


PublishToOMPTask = celery_app.register_task(PublishToOMPTask())
