from test.integration.job_type_test import JobTypeTest


class IngestJournalTest(JobTypeTest):

    def test_journal_import(self):
        """Test ingest journal functionality without OCR tasks."""
        self.stage_resource('files', 'TIFOBJECT-ZID7654321')
        params = self.load_params_from_file('params', 'journal.json')

        data, status_code = self.post_job('ingest_journal', params)
        self.assertEqual(status_code, 202)
        first_job_id = data['job_ids'][0]
        self.assertEqual('Accepted', data['status'])
        self.assert_status(first_job_id, 'SUCCESS', "JOURNAL_TEST_TIMEOUT")

        response = self.get_status(first_job_id)
        self.assertIn('object_id', response['result'])
        object_id = response['result']['object_id']
        journal_code = params['objects'][0]['metadata']['ojs_journal_code']
        self.assertTrue(object_id.startswith("TIFOBJECT-ZID7654321"))

        files_generated = [
            'data/pdf/merged.pdf',
            'meta.json']
        for file in files_generated:
            self.assert_file_in_repository(object_id, file)

        self.unstage_resource('TIFOBJECT-ZID7654321')
