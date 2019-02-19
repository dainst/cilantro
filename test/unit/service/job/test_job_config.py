import unittest

from celery.canvas import Signature

from service.job.job_config import JobConfig, ConfigParseException,\
    UnknownJobTypeException


class JobConfigTest(unittest.TestCase):

    def test_valid(self):
        job_config = JobConfig("test/resources/configs/config_valid")
        job1 = job_config.generate_job("job1", "test_user", {}).chain
        self.assertTrue(
            isinstance(job1, Signature),
            f"job1 is an instance of '{type(job1)}, expected 'Signature'"
            )
        self.assertEqual('celery.chain', job1['task'])

        tasks = job1.tasks
        self.assertEqual(3, len(tasks))

        self.assertEqual('retrieve', tasks[0]['task'])

        self.assertEqual('list_files', tasks[1]['task'])
        kwargs = tasks[1]['kwargs']
        self.assertEqual('tif', kwargs['representation'])
        self.assertEqual('convert', kwargs['subtasks'][0]['name'])
        self.assertEqual('high', kwargs['subtasks'][0]['params']['quality'])

        self.assertEqual('publish', tasks[2]['task'])

        job2 = job_config.generate_job("job2", "test_user", {}).chain
        self.assertTrue(
            isinstance(job2, Signature),
            f"job2 is an instance of '{type(job1)}', expected 'Signature'"
            )
        self.assertEqual('celery.chain', job2['task'])

        tasks = job2.tasks
        self.assertEqual(6, len(tasks))

        self.assertEqual('generate_pdf', tasks[1]['task'])
        self.assertEqual('average', tasks[1]['kwargs']['quality'])

    def test_unknown_job_type(self):
        job_config = JobConfig("test/resources/configs/config_valid")
        self.assertRaises(UnknownJobTypeException, job_config.generate_job,
                          "job3", "test_user", {})

    def test_invalid_yaml(self):
        self.assertRaises(ConfigParseException, JobConfig,
                          "test/resources/configs/config_invalid_yaml")

    def test_invalid_definition_misspelled_keyword(self):
        """Test if job definition has keyword 'tasks'"""
        with self.assertRaises(ConfigParseException) as cm:
            JobConfig("test/resources/configs/config_invalid_def")
        exception_message = str(cm.exception)
        self.assertEqual(exception_message,
                         "Missing attribute 'tasks' in job type job1")

        with self.assertRaises(ConfigParseException) as cm:
            JobConfig("test/resources/configs/config_invalid_def2")
        exception_message = str(cm.exception)
        self.assertEqual(exception_message,
                         "Missing attribute 'tasks' in job type job2")

    def test_list_files(self):
        job_config = JobConfig("test/resources/configs/config_list_files")

        job1 = job_config.generate_job("job1", "test_user", {}).chain

        tasks1 = job1.tasks

        kwargs1 = tasks1[1]['kwargs']
        self.assertEqual('tif', kwargs1['representation'])
        self.assertEqual('.*', kwargs1['pattern'])

        job2 = job_config.generate_job("job2", "test_user", {}).chain

        tasks2 = job2.tasks

        kwargs2 = tasks2[1]['kwargs']
        self.assertEqual('jpg', kwargs2['representation'])
        self.assertEqual('\\.jpg', kwargs2['pattern'])

    def test_list_parts(self):
        job_config = JobConfig("test/resources/configs/config_list_parts")

        job1 = job_config.generate_job("job1", "test_user", {}).chain

        tasks = job1.tasks

        self.assertEqual('list_parts', tasks[1]['task'])
        kwargs = tasks[1]['kwargs']
        self.assertEqual('convert', kwargs['subtasks'][0]['name'])
        self.assertEqual('high', kwargs['subtasks'][0]['params']['quality'])
