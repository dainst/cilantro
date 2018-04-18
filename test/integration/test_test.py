from integration.job_type_test import JobTypeTest


class JobTypeTestTest(JobTypeTest):

    def setUp(self):
        super().setUp()
        self.stage_resource('job_type_test', 'test_object')

    def tearDown(self):
        self.unstage_resource('test_object')
        super().tearDown()

    def test_success(self):
        data = self.post_job('test', 'foo')
        self.assertEqual('Accepted', data['status'])
        self.assert_file_in_repository('foo', 'image1.jpg')
        self.assert_status(data['job_id'], 'SUCCESS')
