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

        job_from_db = self.get_job_by_id(job_id)
        first_batch_job_in_job_from_db = self.get_job_by_id(
            job_from_db['children'][0]['job_id'])

        files_generated = [
            f"data/pdf/{params['targets'][0]['id']}.pdf",
            'meta.json']
        for file in files_generated:
            self.assert_file_in_repository(
                first_batch_job_in_job_from_db['object_id'], file)

        self.unstage_resource('some_tiffs')
