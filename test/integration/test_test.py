import os

from integration.job_type_test import JobTypeTest


class JobTypeTestTest(JobTypeTest):

    def test_success(self):
        data = self.post_job('test', 'foo')
        self.assertEqual('Accepted', data['status'])
        self.assert_file_in_repository('foo', 'image1.jpg')
        self.assert_status(data['job_id'], 'SUCCESS')
