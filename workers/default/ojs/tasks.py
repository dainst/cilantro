import os

from utils.celery_client import celery_app

from workers.base_task import BaseTask
from workers.default.metadata.loader import load_metadata
from workers.default.ojs.publishing import publish_to_ojs
from workers.default.ojs.frontmatter import generate_frontmatter


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
        data = load_metadata(work_path)

        publish_to_ojs(os.path.join(work_path, 'ojs_import.xml'),
                       data['data']['ojs_journal_code'])


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
        generate_frontmatter(id_list)


PublishToOJSTask = celery_app.register_task(PublishToOJSTask())
GenerateFrontmatterTask = celery_app.register_task(GenerateFrontmatterTask())
