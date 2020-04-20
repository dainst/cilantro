from test.integration.job_type_test import JobTypeTest


class IngestJournalTest(JobTypeTest):

    def test_journal_import(self):
        """Test ingest journal functionality without OCR tasks."""
        self.stage_resource('files', 'some_tiffs')
        params = self.load_params_from_file('params', 'journal.json')

        data, status_code = self.post_job('ingest_journals', params)
        self.assertEqual(status_code, 202)
        job_id = data['job_id']
        self.assertTrue(data['success'])
        self.assert_state(job_id, 'success', 120000)

        self.unstage_resource('some_tiffs')
