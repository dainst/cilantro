from test.integration.job_type_test import JobTypeTest


class IngestBookTest(JobTypeTest):

    def test_success(self):
        self.stage_resource('objects', 'some_tiffs')
        params = self.load_params_from_file('params', 'a_book.json')

        data, status_code = self.post_job('ingest_book', params)
        self.assertEquals(status_code, 202)
        job_id = data['job_id']
        self.assertEqual('Accepted', data['status'])
        self.assert_job_successful(data['task_ids'])
        self.assert_file_in_repository(job_id, 'data/tif/test.jpg')
        self.assert_file_in_repository(job_id, 'merged.pdf')

        self.unstage_resource('some_tiffs')
        self.remove_object_from_repository(job_id)
