import os

from utils.celery_client import celery_app
from workers.base_task import ObjectTask

from workers.default.arachne.arachne_publish import publish_pages, \
    add_book_to_db, move_tiff_to_cloud, move_mets_to_cloud, move_pdf_to_cloud


class PublishToArachneTask(ObjectTask):
    name = "publish_to_arachne"

    def process_object(self, obj):
        target_path = os.environ['ARCHAEOCLOUD_PATH']
        object_id = self.get_param('object_id')

        book_id = add_book_to_db(obj, object_id)

        publish_pages(book_id, obj, object_id, target_path)

        move_tiff_to_cloud(target_path, obj, object_id, book_id)
        move_mets_to_cloud(target_path, obj, object_id)
        move_pdf_to_cloud(target_path, obj, object_id)


PublishToArachneTask = celery_app.register_task(PublishToArachneTask())
