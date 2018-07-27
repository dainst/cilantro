import os

from utils.celery_client import celery_app
from workers.base_task import BaseTask

from workers.default.ojs.publishing import publish_to_ojs


class PublishToOJSTask(BaseTask):
    """
    Publish documents in the XML in the working directory via OJS-Plugin.

    Preconditions:
    -ojs_import.xml in the working dir
    """

    name = "publish_to_ojs"

    def execute_task(self):
        """Execute task intructions."""
        work_path = self.get_work_path()
        publish_to_ojs(os.path.join(work_path, 'ojs_import.xml'))


PublishToOJSTask = celery_app.register_task(PublishToOJSTask())
