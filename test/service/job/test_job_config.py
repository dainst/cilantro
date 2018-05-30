import logging
import unittest
import os

from celery.canvas import Signature

from service.job.job_config import JobConfig, ConfigParseException,\
    UnknownJobTypeException


class JobConfigTest(unittest.TestCase):

    def test_valid(self):
        os.environ['CONFIG_DIR'] = "test/resources/configs/config_valid"

        job_config = JobConfig()
        job1 = job_config.generate_job("job1", "foo").chain
        self.assertTrue(
            isinstance(job1, Signature),
            "job1 is an instance of '%s', expected 'Signature'" % type(job1)
        )
        self.assertEqual('celery.chain', job1['task'])

        tasks = job1.tasks
        self.assertEqual(3, len(tasks))

        self.assertEqual('retrieve', tasks[0]['task'])
        self.assertEqual('foo', tasks[0]['kwargs']['object_id'])

        self.assertEqual('foreach', tasks[1]['task'])
        kwargs = tasks[1]['kwargs']
        self.assertEqual('foo', kwargs['object_id'])
        self.assertEqual('retrieve', kwargs['prev_task'])
        self.assertEqual('*.tif', kwargs['pattern'])
        self.assertEqual('convert', kwargs['subtasks'][0]['name'])
        self.assertEqual('high', kwargs['subtasks'][0]['params']['quality'])

        self.assertEqual('publish', tasks[2]['task'])
        self.assertEqual('foo', tasks[2]['kwargs']['object_id'])
        self.assertEqual('foreach', tasks[2]['kwargs']['prev_task'])

        job2 = job_config.generate_job("job2", "bar").chain
        self.assertTrue(
            isinstance(job2, Signature),
            "job2 is an instance of'%s', expected 'Signature'" % type(job1)
        )
        self.assertEqual('celery.chain', job2['task'])

        tasks = job2.tasks
        self.assertEqual(6, len(tasks))

        self.assertEqual('generate_pdf', tasks[1]['task'])
        self.assertEqual('average', tasks[1]['kwargs']['quality'])

    def test_unknown_job_type(self):
        os.environ['CONFIG_DIR'] = "test/resources/configs/config_valid"
        job_config = JobConfig()
        self.assertRaises(UnknownJobTypeException, job_config.generate_job,
                          "job3", "foo")

    def test_invalid_yaml(self):
        os.environ['CONFIG_DIR'] = "test/resources/configs/config_invalid_yaml"
        self.assertRaises(ConfigParseException, JobConfig)

    def test_invalid_definition(self):
        os.environ['CONFIG_DIR'] = "test/resources/configs/config_invalid_def"
        self.assertRaises(ConfigParseException, JobConfig)
