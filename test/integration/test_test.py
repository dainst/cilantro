from integration.job_type_test import JobTypeTest


class JobTypeTestTest(JobTypeTest):

    def setUp(self):
        super().setUp()
        self.stage_resource('objects', 'some_tiffs')

    def tearDown(self):
        self.unstage_resource('some_tiffs')
        super().tearDown()

    def test_success(self):
        data = self.post_job('test', 'some_tiffs')
        self.assertEqual('Accepted', data['status'])
        self.assert_file_in_repository('some_tiffs', 'test.jpg')
        self.assert_status(data['job_id'], 'SUCCESS')
