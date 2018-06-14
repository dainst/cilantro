from test.integration.job_type_test import JobTypeTest


class NlpWorkerTest(JobTypeTest):

    def test_success(self):
        self.stage_resource('objects', 'nlp')

        job = self.post_job('nlp_pipe', 'nlp')
        self.assertEqual('Accepted', job['status'])
        self.assert_status(job['job_id'], 'SUCCESS')

        self.unstage_resource('nlp')
        self.remove_object_from_repository('nlp')
