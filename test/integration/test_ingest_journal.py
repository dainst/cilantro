from test.integration.job_type_test import JobTypeTest


class IngestJournalTest(JobTypeTest):

    def test_journal_import(self):
        """Test ingest journal functionality without OCR tasks."""
        self.stage_resource('files', 'some_tiffs')
        params = self.load_params_from_file('params', 'journal.json')

        data, status_code = self.post_job('ingest_journals', params)
        self.assertEqual(status_code, 202)
        first_job_id = data['job_id']
        self.assertTrue(data['success'])
        self.assert_state(first_job_id, 'success', "JOURNAL_TEST_TIMEOUT")

        response = self.get_job_by_id(first_job_id)
        object_id = response['parameters']['objects'][0]['id']

        files_generated = [
            f"data/pdf/{object_id}.pdf",
            'meta.json']
        for file in files_generated:
            self.assert_file_in_repository(object_id, file)

        self.unstage_resource('some_tiffs')
