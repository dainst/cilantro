import os

from test.service.integration.job_type_test import JobTypeTest


class NlpTest(JobTypeTest):
    """Test job executing some nlp tasks."""

    @staticmethod
    def _timeout():
        return int(os.environ.get('NLP_TEST_TIMEOUT'))

    def test_nlp(self):
        """Test nlp functionality.

        Starts a job that triggers some annotation functionalities and checks that
        all the relevant files are created.
        """
        self.unstage_resource('some_texts')
        self.stage_resource('files', 'some_texts')
        params = self.load_params_from_file('params', 'nlp.json')

        data, status_code = self.post_job('nlp', params)
        self.assertEqual(status_code, 202)
        self.assertTrue(data['success'])

        job_id = data['job_id']

        self.assert_state(job_id, 'success', self._timeout())

        job_from_db = self.get_job_by_id(job_id)

        # The first child is the "txt" job, the second is the "pdf" job.
        # This is controlled by the "extension" parameter.
        txt_job_id = job_from_db['children'][0]['job_id']
        pdf_job_id = job_from_db['children'][1]['job_id']

        # The staged file "txt/timex1.txt" is annotated directly and we expect just the results
        self.assert_file_in_workdir(txt_job_id, f"data/xmi.time/timex1.xmi", self._timeout())
        self.assert_file_in_workdir(txt_job_id, f"data/xmi.time.entities/timex1.xmi", self._timeout())

        # The staged pdf "pdf/timex2.pdf" is converted to txt, annotated for pages, times, entities
        # and finally json for the book viewer is created
        self.assert_file_in_workdir(pdf_job_id, f"data/txt/timex2_0000.txt", self._timeout())
        self.assert_file_in_workdir(pdf_job_id, f"data/txt/timex2_0001.txt", self._timeout())
        self.assert_file_in_workdir(pdf_job_id, f"data/xmi.pages/timex2.xmi", self._timeout())
        self.assert_file_in_workdir(pdf_job_id, f"data/xmi.pages.time/timex2.xmi", self._timeout())
        self.assert_file_in_workdir(pdf_job_id, f"data/xmi.pages.time.entities/timex2.xmi", self._timeout())
        self.assert_file_in_workdir(pdf_job_id, f"data/json/timex2.json", self._timeout())

        self.unstage_resource('some_texts')
