from test.integration.job_type_test import JobTypeTest


class IngestBookTest(JobTypeTest):

    def test_success(self):
        self.stage_resource('objects', 'some_tiffs')

        data = self.post_job('ingest_book', 'some_tiffs')
        self.assertEqual('Accepted', data['status'])
        self.assert_file_in_repository('some_tiffs', 'test.jpg')
        self.assert_status(data['job_id'], 'SUCCESS')

        self.unstage_resource('some_tiffs')

    def test_error(self):
        self.stage_resource('objects', 'test_object')

        data = self.post_job('ingest_book', 'test_object')
        self.assertEqual('Accepted', data['status'])
        self.assert_status(data['job_id'], 'ERROR')

        self.unstage_resource('test_object')
