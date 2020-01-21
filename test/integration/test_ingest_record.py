from test.integration.job_type_test import JobTypeTest


class IngestRecordTest(JobTypeTest):
    """Test record (aka Retrodigitalisat) import job."""

    def test_record_import(self):
        """Test ingest record functionality.

        It basically just starts a job with some test data found in the
        test/resources directory and checks some values on the returned data
        from the call itself and returned values of subsequent calls on the
        job status endpoint.
        """
        self.stage_resource('files', 'some_tiffs')
        params = self.load_params_from_file('params', 'record.json')

        data, status_code = self.post_job('ingest_records', params)
        self.assertEqual(status_code, 202)
        self.assertTrue(data['success'])

        job_id = data['job_id']
        self.assert_state(job_id, 'success')

        job_from_db = self.get_job_by_id(job_id)
        first_batch_job_in_job_from_db = self.get_job_by_id(
            job_from_db['children'][0]['job_id'])

        files_generated = [
            f"data/pdf/{first_batch_job_in_job_from_db['object_id']}.pdf",
            'meta.json']
        for file in files_generated:
            self.assert_file_in_repository(
                first_batch_job_in_job_from_db['object_id'], file)
        self.unstage_resource('some_tiffs')
