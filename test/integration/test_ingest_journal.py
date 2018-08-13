from test.integration.job_type_test import JobTypeTest


class IngestJournalTest(JobTypeTest):

    def test_success(self):
        self.stage_resource('objects', 'pdf')
        params = self.load_params_from_file('params', 'a_journal.json')

        data, status_code = self.post_job('ingest_journal', params)
        self.assertEquals(status_code, 202)
        job_id = data['job_id']
        self.assertEqual('Accepted', data['status'])
        self.assert_status(job_id, 'SUCCESS', 120000)

        files_generated = [
            'data/origin/merged.pdf',
            'data/txt/merged_1.txt',
            'data/txt/merged_1.json',
            'parts/part_0001/data/origin/merged.pdf',
            'parts/part_0001/meta.json',
            'parts/part_0001/marc.xml',
            'parts/part_0002/data/origin/merged.pdf',
            'parts/part_0002/meta.json',
            'parts/part_0002/marc.xml',
            'meta.json',
            'ojs_import.xml'
        ]
        for file in files_generated:
            self.assert_file_in_repository(job_id, file)
        self.unstage_resource('pdf')
