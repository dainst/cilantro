import os

from utils.celery_client import celery_app

from workers.base_task import BaseTask
from workers.default.ojs.ojs_api import publish, generate_frontmatters


def _generate_object_id(journal_code, result):
    return f"journal-{journal_code}-{result['published_issues'][0]}"


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
        data = self.get_param('ojs_metadata')

        _, result = publish(os.path.join(work_path, 'ojs_import.xml'),
                            data['ojs_journal_code'])

        object_id = _generate_object_id(data['ojs_journal_code'], result)
        return {'object_id': object_id}


class GenerateFrontmatterTask(BaseTask):
    """
    Generate and add frontpage to documents in OJS.

    Add a new page at the start of the referenced document. The IDs
    for the documents are taken from UI parameters.
    """

    name = "generate_frontmatter"

    def execute_task(self):
        """Execute task intructions."""
        id_list = self.get_param('frontmatter_ids')
        generate_frontmatters(id_list)


PublishToOJSTask = celery_app.register_task(PublishToOJSTask())
GenerateFrontmatterTask = celery_app.register_task(GenerateFrontmatterTask())
