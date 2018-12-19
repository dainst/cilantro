import os
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

        cloud_files = [
            os.path.join(self.BOOKSCAN_PATH, self.test_object_id,
                         'BOOK-' + self.test_object_id + '-0_test.jpg'),
            os.path.join(self.PDF_FOLDER, self.test_object_id + '.pdf.zip')
            # TODO mets
            ]

        for f in cloud_files:
            self.assertTrue(Path(f).is_file())

        # self._clean_database_entries()

        self.unstage_resource('some_tiffs')
        self.remove_object_from_repository(self.test_object_id)

    def _clean_database_entries(self):
        book_query = ("SELECT PS_BuchID FROM arachne.buch "
                      "WHERE BearbeiterBuch = 'cilantro'")
        query_result = mysql.query(book_query)
        for result_dict in query_result:
            book_id = result_dict['PS_BuchID']
            image_delete_query = (f"DELETE FROM arachne.marbilder "
                                  f"WHERE FS_BuchID={book_id}")
            mysql.delete(image_delete_query)

        page_delete_query = ("DELETE FROM arachne.buchseite "
                             "WHERE BearbeiterBuchseite = 'cilantro'")
        mysql.delete(page_delete_query)

        book_delete_query = ("DELETE FROM arachne.buch "
                             "WHERE BearbeiterBuch = 'cilantro'")
        mysql.delete(book_delete_query)
