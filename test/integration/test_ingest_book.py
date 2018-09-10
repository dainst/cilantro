from test.integration.job_type_test import JobTypeTest


class IngestBookTest(JobTypeTest):

    test_object_id = "test_object_2342"

    def test_success(self):
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

        self.unstage_resource('some_tiffs')
        self.remove_object_from_repository(self.test_object_id)
