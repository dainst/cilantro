from test.integration.job_type_test import JobTypeTest


class IngestJournalTest(JobTypeTest):

    def test_success(self):
        self.stage_resource('objects', 'pdf')

        job = self.post_job('ingest_journal', 'pdf')
        self.assertEqual('Accepted', job['status'])
        self.assert_status(job['job_id'], 'SUCCESS')

        files_generated = [f'e2e-testing.pdf.0.pdf', f'e2e-testing.pdf.1.pdf']
        for file in files_generated:
            self.assert_file_in_repository('pdf', file)
        self.unstage_resource('pdf')
        self.remove_object_from_repository('pdf')
