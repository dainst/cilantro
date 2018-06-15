from test.integration.job_type_test import JobTypeTest


class NlpWorkerTest(JobTypeTest):

    def test_success(self):
        self.stage_resource('objects', 'nlp')

        data = self.post_job('nlp_pipe', {'paths': ['nlp']})
        job_id = data['job_id']
        self.assertEqual('Accepted', data['status'])
        self.assert_status(job_id, 'SUCCESS')

        self.unstage_resource('nlp')
        self.remove_object_from_repository(job_id)
