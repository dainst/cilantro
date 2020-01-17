
from test.integration.job_type_test import JobTypeTest

import glob
import os.path

class NlpTaskTest(JobTypeTest):
    """Test job executing some nlp tasks."""

    def test_nlp_task(self):
        """Test nlp task functionality.

        Starts a job that triggers some annotation functionalities and checks that
        all the relevant files are created.
        """
        self.stage_resource('files', 'some_texts')
        params = self.load_params_from_file('params', 'nlp_task.json')

        data, status_code = self.post_job('nlp_task', params)
        self.assertEqual(status_code, 202)
        self.assertTrue(data['success'])

        job_id = data['job_id']

        self.assert_state(job_id, 'success', 'NLP_TEST_TIMEOUT')

        job_from_db = self.get_job_by_id(job_id)
        first_job_id = job_from_db['children'][0]['job_id']

        # the input file's basenames that were staged above
        input_basenames = [ "timex1", "timex2" ]
        for basename in input_basenames:
            self.assert_file_in_workdir(first_job_id, f"data/xml/{basename}.xml")
            self.assert_file_in_workdir(first_job_id, f"data/json/{basename}-annotations-time-expression.json")
        self.unstage_resource('some_texts')

