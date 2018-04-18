import os

from integration.job_type_test import JobTypeTest


class JobTypeTestTest(JobTypeTest):

    def test_success(self):
        data = self._post_job('test', 'foo')
        self.assertEqual('Accepted', data['status'])

        path = os.path.join(self.repository_dir, 'foo', 'image1.jpg')
        self.assertTrue(self._wait_for_file(path), "expected %s to be present" % path)

        job_id = data['job_id']
        self.assertEqual('PENDING', self._get_status(job_id))
        self.assertTrue(self._wait_for_status(job_id, 'SUCCESS'), "timeout while waiting for status 'SUCCESS'")
