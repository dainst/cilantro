import os
import json
from pathlib import Path

from utils import mysql

from test.integration.job_type_test import JobTypeTest


class IngestBookTest(JobTypeTest):
    """
    Test ingest-book task.

    Creates a task from example data in the test-resource folder
    and makes some checks for generated files.

    Cleans up any generated files and database entries.
    """

    test_object_id = "test_object_2342"

    def test_success(self):
        """Test ingest book task chain."""
        self.stage_resource('files', 'some_tiffs')
        params = self.load_params_from_file('params', 'a_book.json')

        data, status_code = self.post_job('ingest_book', params)
        self.assertEqual(status_code, 202)
        self.assertEqual('Accepted', data['status'])
        self.assert_job_successful(data['task_ids'])

        files_generated = [
            'data/jpg/test.jpg',
            'data/jpg/test2.jpg',
            'data/jpg/test3.jpg',
            'data/jpg/test4.jpg',
            'data/pdf/merged.pdf',
            'meta.json'
            ]
        for file in files_generated:
            self.assert_file_in_repository(self.test_object_id, file)

        # Get arachne ID from metadata file
        with open(os.path.join(self.repository_dir, self.test_object_id,
                               'meta.json'), 'r') as metadata_file:
            self.arachne_book_id = json.load(metadata_file)['arachne_id']

        cloud_files = [
            os.path.join(self.BOOKSCAN_PATH, self.test_object_id,
                         'BOOK-' + self.test_object_id + '-0_test.jpg'),
            os.path.join(self.TEI_PATH, self.test_object_id,
                         'transcription.xml'),
            os.path.join(self.PTIF_PATH,
                         _generate_folder_name(self.test_object_id,
                                               self.arachne_book_id),
                         'BOOK-' + self.test_object_id + '-0_test.ptif'),
            os.path.join(self.ARCHIVE_PATH, self.test_object_id, 'Rohscans',
                         'BOOK-' + self.test_object_id + '-0_test.tif'),
            os.path.join(self.ARCHIVE_PATH, self.test_object_id,
                         'datenbankfertig',
                         'BOOK-' + self.test_object_id + '-0_test.jpg'),
            os.path.join(self.PDF_PATH, self.test_object_id + '.pdf.zip')]
        for f in cloud_files:
            self.assertTrue(Path(f).is_file())

        _clean_database_entries(arachne_book_id)
        self.unstage_resource('some_tiffs')
        self.remove_object_from_repository(self.test_object_id)


def _generate_folder_name(object_id, book_id):
    """Generate folder name in the cloud from Xenon and Arachne IDs."""
    formatted_book_id = '{:06d}'.format(int(book_id))
    return f"BOOK-ZID{object_id}-AraID{formatted_book_id}"


def _clean_database_entries(arachne_book_id):
    book_delete_query = ("DELETE FROM arachne.buch "
                         f"WHERE PS_BuchID = {arachne_book_id}")
    mysql.delete(book_delete_query)

    page_delete_query = ("DELETE FROM arachne.buchseite "
                         f"WHERE FS_BuchID = {arachne_book_id}")
    mysql.delete(page_delete_query)

    image_delete_query = ("DELETE FROM arachne.marbilder "
                          f"WHERE FS_BuchID={arachne_book_id}")
    mysql.delete(image_delete_query)
