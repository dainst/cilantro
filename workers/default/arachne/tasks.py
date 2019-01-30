from utils.celery_client import celery_app
from workers.base_task import ObjectTask

from workers.default.arachne.db_publish import add_pages, add_book
from workers.default.arachne.cloud_publish import move_jpeg_to_cloud, \
    move_tiff_to_cloud, move_pdf_to_cloud, move_ptif_to_cloud, \
    move_tei_to_cloud


class PublishToArachneDBTask(ObjectTask):
    """Create tables in for book and pages in Arachne's database."""

    name = "publish_to_arachne_db"

    def process_object(self, obj):
        object_id = self.get_param('object_id')
        username = self.get_param('user')

        book_id = add_book(obj, object_id, username)
        obj.metadata.arachne_id = book_id
        obj.write()
        add_pages(book_id, obj, object_id, username)


class PublishToCloudTask(ObjectTask):
    """Move files representing the book to specific folders in the cloud."""

    name = "publish_to_cloud"

    def process_object(self, obj):
        object_id = self.get_param('object_id')
        arachne_book_id = obj.metadata.to_dict()['arachne_id']

        move_jpeg_to_cloud(object_id, arachne_book_id, obj)
        move_tiff_to_cloud(object_id, arachne_book_id, obj)
        move_ptif_to_cloud(object_id, arachne_book_id, obj)
        # move_mets_to_cloud(object_id, arachne_book_id, obj) # TODO
        move_tei_to_cloud(object_id, arachne_book_id, obj)
        move_pdf_to_cloud(object_id, obj)


PublishToArachneDBTask = celery_app.register_task(PublishToArachneDBTask())
PublishToCloudTask = celery_app.register_task(PublishToCloudTask())
