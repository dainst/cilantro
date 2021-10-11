from test.service.integration.job_type_test import JobTypeTest


class IngestMonographsTest(JobTypeTest):

    def test_monographs_import(self):
        """Test ingest monographs functionality without OCR tasks."""
        self.stage_resource('files', 'some_tiffs')
        params = self.load_params_from_file('params', 'monograph.json')

        data, status_code = self.post_job('ingest_monographs', params)
        print(data)
        print(status_code)
        self.assertEqual(status_code, 202)
        job_id = data['job_id']
        self.assertTrue(data['success'])
        self.assert_state(job_id, 'success', 120000)

        self.unstage_resource('some_tiffs')
