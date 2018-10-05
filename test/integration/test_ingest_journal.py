import os

from test.integration.job_type_test import JobTypeTest


class IngestJournalTest(JobTypeTest):

    def test_no_ocr(self):
        """Test ingest journal functionality without OCR tasks."""
        self.stage_resource('files', 'test.pdf')
        params = self.load_params_from_file('params', 'a_journal.json')

        data, status_code = self.post_job('ingest_journal', params)
        self.assertEqual(status_code, 202)
        job_id = data['job_id']
        self.assertEqual('Accepted', data['status'])
        self.assert_status(job_id, 'SUCCESS', 120000)

        response = self.get_status(job_id)
        self.assertIn('object_id', response['result'])
        object_id = response['result']['object_id']
        journal_code = params['ojs_metadata']['ojs_journal_code']
        self.assertTrue(object_id.startswith(f"issue-{journal_code}"))

        files_generated = [
            'data/origin/merged.pdf',
            'parts/part_0001/data/origin/merged.pdf',
            'parts/part_0001/meta.json',
            'parts/part_0001/marc.xml',
            'parts/part_0001/mets.xml',
            'parts/part_0001/data/txt/merged_0.txt',
            'parts/part_0001/data/txt/annotations.json',
            'parts/part_0002/data/origin/merged.pdf',
            'parts/part_0002/meta.json',
            'parts/part_0002/marc.xml',
            'parts/part_0002/mets.xml',
            'parts/part_0002/data/txt/merged_0.txt',
            'parts/part_0002/data/txt/annotations.json',
            'meta.json',
            'ojs_import.xml'
            ]
        for file in files_generated:
            self.assert_file_in_repository(object_id, file)

        # Prüfen ob die generierte XMLs galley enthält, was für den OJS
        # Import und frontmatter generation noetig ist
        file_path = os.path.join(os.environ['REPOSITORY_DIR'], object_id,
                                 'ojs_import.xml')
        with open(file_path, 'r') as f:
            xml_content = f.read()
        self.assertIn("galley", xml_content)

        self.unstage_resource('pdf')

    def test_do_ocr(self):
        """Test ingest journal functionality with OCR tasks enabled."""
        self.stage_resource('files', 'test.pdf')
        params = self.load_params_from_file('params', 'a_journal_do_ocr.json')

        data, status_code = self.post_job('ingest_journal', params)
        self.assertEqual(status_code, 202)
        job_id = data['job_id']
        self.assertEqual('Accepted', data['status'])
        self.assert_status(job_id, 'SUCCESS', 120000)

        response = self.get_status(job_id)
        self.assertIn('object_id', response['result'])
        object_id = response['result']['object_id']
        journal_code = params['ojs_metadata']['ojs_journal_code']
        self.assertTrue(object_id.startswith(f"issue-{journal_code}"))

        files_generated = [
            'parts/part_0001/data/origin/merged.pdf',
            'parts/part_0001/meta.json',
            'parts/part_0001/marc.xml',
            'parts/part_0001/data/tif/merged_0.tif',
            'parts/part_0001/data/txt/merged_0.txt',
            'parts/part_0001/data/txt/annotations.json',
            'parts/part_0002/data/origin/merged.pdf',
            'parts/part_0002/meta.json',
            'parts/part_0002/marc.xml',
            'parts/part_0002/data/tif/merged_0.tif',
            'parts/part_0002/data/txt/merged_0.txt',
            'parts/part_0002/data/txt/annotations.json',
            'meta.json',
            'ojs_import.xml'
            ]
        for file in files_generated:
            self.assert_file_in_repository(object_id, file)
        self.unstage_resource('pdf')
