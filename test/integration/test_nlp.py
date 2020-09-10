
import os

from test.integration.job_type_test import JobTypeTest


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

        # "txt/timex1.txt" and "pdf/timex2.pdf" were staged above, the pdf has two pages
        self.assert_file_in_workdir(txt_job_id, f"data/xml/timex1.xml", self._timeout())
        self.assert_file_in_workdir(pdf_job_id, f"data/xml/timex2_0000.xml", self._timeout())
        self.assert_file_in_workdir(pdf_job_id, f"data/xml/timex2_0001.xml", self._timeout())

        self.unstage_resource('some_texts')
