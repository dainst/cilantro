import os

from utils.celery_client import celery_app

from workers.base_task import ObjectTask
from workers.default.ojs.ojs_api import publish, generate_frontmatters


def _generate_object_id(prefix, journal_code, result_id):
    return f"{prefix}-{journal_code}-{result_id}"


class PublishToOJSTask(ObjectTask):
    """
    Publish documents in the XML in the working directory via OJS-Plugin.

    Preconditions:
    -ojs_import.xml in the working dir
    """

    name = "publish_to_ojs"

    def process_object(self, obj):
        work_path = self.get_work_path()
        ojs_metadata = self.get_param(self.get_param('params'))

        _, result = publish(os.path.join(work_path, 'ojs_import.xml'),
                            ojs_metadata['ojs_journal_code'])

        children = obj.get_parts()
        for i, child in enumerate(children):
            child.metadata.ojs_id = _generate_object_id('article',
                ojs_metadata['ojs_journal_code'],
                result['published_articles'][i])
            child.write()

        object_id = _generate_object_id('issue',
                                        ojs_metadata['ojs_journal_code'],
                                        result['published_issues'][0])
        obj.metadata.ojs_id = object_id
        obj.write()

        return {'object_id': object_id}


class GenerateFrontmatterTask(ObjectTask):
    """Generate and add frontpage to the article in OJS."""

    name = "generate_frontmatter"

    def process_object(self, obj):
        if obj.metadata.create_frontpage:
            article_id = obj.metadata.ojs_id.split("-")[-1]
            generate_frontmatters([article_id])


PublishToOJSTask = celery_app.register_task(PublishToOJSTask())
GenerateFrontmatterTask = celery_app.register_task(GenerateFrontmatterTask())
