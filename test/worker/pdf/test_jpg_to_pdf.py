from test.integration.job_type_test import JobTypeTest


class JpgToPdf(JobTypeTest):

    def test_success(self):
        self.stage_resource('objects', 'jpegs')
        job = self.post_job('jpg_to_pdf', 'jpegs')
        self.assertEqual('Accepted', job['status'])
        self.assert_status(job['job_id'], 'SUCCESS')
        files_generated = [f'merged.pdf']
        for file in files_generated:
            self.assert_file_in_repository('jpegs', file)
        self.unstage_resource('jpegs')
        self.remove_object_from_repository('jpegs')
