from test.integration.job_type_test import JobTypeTest


class NlpWorkerTest(JobTypeTest):

    def test_success(self):
        self.stage_resource('objects', 'nlp_worker')

        job = self.post_job('nlp_worker', 'nlp_worker')
        self.assertEqual('Accepted', job['status'])
        self.assert_status(job['job_id'], 'SUCCESS')

        self.unstage_resource('nlp_worker')
        self.remove_object_from_repository('nlp_worker')
