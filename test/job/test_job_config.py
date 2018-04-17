import unittest
import os

from celery.canvas import Signature

from service.job.job_config import JobConfig, ConfigParseException, UnknownJobTypeException


class JobConfigTest(unittest.TestCase):

    def test_valid(self):
        os.environ['CONFIG_DIR'] = "test/resources/job_config_test/config_valid"

        job_config = JobConfig()
        job1 = job_config.generate_job("job1", "foo").chain
        self.assertTrue(isinstance(job1, Signature), "job1 is an instance of '%s', expected 'Signature'" % type(job1))
        self.assertEqual('celery.chain', job1['task'])

        tasks = job1.tasks
        self.assertEqual(3, len(tasks))

        self.assertEqual('retrieve', tasks[0]['task'])
        self.assertEqual('foo', tasks[0]['kwargs']['object_id'])

        self.assertEqual('match', tasks[1]['task'])
        self.assertEqual('foo', tasks[1]['kwargs']['object_id'])
        self.assertEqual('retrieve', tasks[1]['kwargs']['prev_task'])
        self.assertEqual('*.tif', tasks[1]['kwargs']['pattern'])
        self.assertEqual('convert', tasks[1]['kwargs']['run'])

        self.assertEqual('publish', tasks[2]['task'])
        self.assertEqual('foo', tasks[2]['kwargs']['object_id'])
        self.assertEqual('match', tasks[2]['kwargs']['prev_task'])

        job2 = job_config.generate_job("job2", "bar").chain
        self.assertTrue(isinstance(job2, Signature), "job2 is an instance of '%s', expected 'Signature'" % type(job1))
        self.assertEqual('celery.chain', job2['task'])

        tasks = job2.tasks
        self.assertEqual(6, len(tasks))

    def test_unknown_job_type(self):
        os.environ['CONFIG_DIR'] = "test/resources/job_config_test/config_valid"
        job_config = JobConfig()
        self.assertRaises(UnknownJobTypeException, job_config.generate_job, "job3", "foo")

    def test_invalid_yaml(self):
        os.environ['CONFIG_DIR'] = "test/resources/job_config_test/config_invalid_yaml"
        self.assertRaises(ConfigParseException, JobConfig)

    def test_invalid_definition(self):
        os.environ['CONFIG_DIR'] = "test/resources/job_config_test/config_invalid_definition"
        self.assertRaises(ConfigParseException, JobConfig)
