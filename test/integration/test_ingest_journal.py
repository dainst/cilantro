from test.integration.job_type_test import JobTypeTest


class IngestJournalTest(JobTypeTest):

    def test_success(self):
        self.stage_resource('objects', 'pdf')

        files = [{"file": "e2e-testing.pdf", "range": [1, 20]}, {"file": "e2e-testing.pdf", "range": [21, 27]}]
        data = self.post_job('ingest_journal', {'paths': ['pdf'], 'files_to_split': files})
        job_id = data['job_id']
        self.assertEqual('Accepted', data['status'])
        self.assert_status(job_id, 'SUCCESS')

        files_generated = [f'e2e-testing.pdf.0.pdf', f'e2e-testing.pdf.1.pdf']
        for file in files_generated:
            self.assert_file_in_repository(job_id, file)
        self.unstage_resource('pdf')
        self.remove_object_from_repository(job_id)
