import os
import logging
from utils.celery_client import celery_app

from workers.base_task import ObjectTask
from workers.default.ojs.ojs_api import publish, generate_frontmatter

log = logging.getLogger(__name__)

def _generate_ojs_id(prefix, journal_code, result_id):
    return f"{prefix}-{journal_code}-{result_id}"


class PublishToOJSTask(ObjectTask):
    """
    Publish documents in the XML in the working directory via OJS-Plugin.

    Preconditions:
    -ojs_import.xml in the working dir
    """

    name = "publish_to_ojs"
    label = "Publish to OJS"
    description = "Publishes the current result in OJS."

    def process_object(self, obj):
        work_path = self.get_work_path()
        ojs_journal_code = self.get_param('ojs_journal_code')

        _, result = publish(os.path.join(work_path, 'ojs_import.xml'),
                            ojs_journal_code)

        if len(result['warnings']) > 0:
            raise RuntimeError(result['warnings'])
        else:
            ojs_id = _generate_ojs_id('issue',
                                      ojs_journal_code,
                                      result['published_issues'][0])
            obj.metadata['ojs_id'] = ojs_id
            obj.write()


class GenerateFrontmatterTask(ObjectTask):
    """Generate and add frontpage to the article in OJS."""

    name = "generate_frontmatter"
    label = "Generate frontmatter"
    description = "Generates an article frontmatter for OJS."

    def process_object(self, obj):
        if 'create_frontpage' in obj.metadata.to_dict() and \
           obj.metadata.create_frontpage:
            article_id = obj.metadata.ojs_id.split("-")[-1]
            generate_frontmatter(article_id)


PublishToOJSTask = celery_app.register_task(PublishToOJSTask())
GenerateFrontmatterTask = celery_app.register_task(GenerateFrontmatterTask())
