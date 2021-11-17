from test.service.integration.job_type_test import JobTypeTest

class IngestJournalTest(JobTypeTest):
    
    def test_journal_import(self):
        """Test ingest journal functionality without OCR."""
        self.stage_resource('files', 'ingest-journals')
        params = self.load_params_from_file('params', 'journal.json')

        params["options"]["ocr_options"]["do_ocr"] = False

        data, status_code = self.post_job('ingest_journals', params)

        self.assertEqual(status_code, 202)
        job_id = data['job_id']

        self.assertTrue(data['success'])
        self.assert_state(job_id, 'success', 1000 * 60)

        self.unstage_resource('ingest-journals')
