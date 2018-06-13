import unittest
import os

from celery.canvas import Signature

from service.job.job_config import JobConfig, ConfigParseException,\
    UnknownJobTypeException, RequestParameterException


class JobConfigTest(unittest.TestCase):

    def test_valid(self):
        os.environ['CONFIG_DIR'] = "test/resources/configs/config_valid"

        job_config = JobConfig()
        job1 = job_config.generate_job("job1", "foo").chain
        self.assertTrue(
            isinstance(job1, Signature),
            f"job1 is an instance of '{type(job1)}, expected 'Signature'"
        )
        self.assertEqual('celery.chain', job1['task'])

        tasks = job1.tasks
        self.assertEqual(3, len(tasks))

        self.assertEqual('retrieve', tasks[0]['task'])
        self.assertEqual('foo', tasks[0]['kwargs']['object_id'])

        self.assertEqual('foreach', tasks[1]['task'])
        kwargs = tasks[1]['kwargs']
        self.assertEqual('foo', kwargs['object_id'])
        self.assertEqual('*.tif', kwargs['pattern'])
        self.assertEqual('convert', kwargs['subtasks'][0]['name'])
        self.assertEqual('high', kwargs['subtasks'][0]['params']['quality'])

        self.assertEqual('publish', tasks[2]['task'])
        self.assertEqual('foo', tasks[2]['kwargs']['object_id'])

        job2 = job_config.generate_job("job2", "bar").chain
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

    def test_invalid_params(self):
        os.environ['CONFIG_DIR'] = "test/resources/configs/config_invalid_param"
        self.assertRaises(ConfigParseException, JobConfig)

    def test_config_param_in_task(self):
        os.environ['CONFIG_DIR'] = "test/resources/configs/config_params"

        job_config = JobConfig()

        job = job_config.generate_job("job1", "foo").chain

        tasks = job.tasks

        self.assertIn('do_task2', tasks[0].kwargs)
        self.assertIn('do_task2', tasks[1].kwargs)

    def test_request_param_in_task(self):
        os.environ['CONFIG_DIR'] = "test/resources/configs/config_params"

        job_config = JobConfig()

        job = job_config.generate_job("job1", "foo", {'do_task2': True}).chain

        tasks = job.tasks

        self.assertIn('do_task2', tasks[0].kwargs)
        self.assertIn('do_task2', tasks[1].kwargs)

    def test_if_param_true(self):
        os.environ['CONFIG_DIR'] = "test/resources/configs/config_if"

        job_config = JobConfig()

        job = job_config.generate_job("job1", "foo", {"do_task2": True}).chain

        tasks = job.tasks
        self.assertEqual(3, len(tasks))

        self.assertEqual('task1', tasks[0]['task'])
        self.assertEqual('task2', tasks[1]['task'])
        self.assertEqual('task3', tasks[2]['task'])

    def test_if_param_false(self):
        os.environ['CONFIG_DIR'] = "test/resources/configs/config_if"

        job_config = JobConfig()

        job = job_config.generate_job("job1", "foo", {"do_task2": False}).chain

        tasks = job.tasks
        self.assertEqual(2, len(tasks))

        self.assertEqual('task1', tasks[0]['task'])
        self.assertEqual('task3', tasks[1]['task'])

    def test_if_param_not_set(self):
        os.environ['CONFIG_DIR'] = "test/resources/configs/config_if"

        job_config = JobConfig()

        job = job_config.generate_job("job1", "foo").chain

        tasks = job.tasks
        self.assertEqual(2, len(tasks))

        self.assertEqual('task1', tasks[0]['task'])
        self.assertEqual('task3', tasks[1]['task'])

    def test_if_else_param_true(self):
        os.environ['CONFIG_DIR'] = "test/resources/configs/config_if"

        job_config = JobConfig()

        job = job_config.generate_job("job2", "foo", {"do_task2": True}).chain

        tasks = job.tasks
        self.assertEqual(4, len(tasks))

        self.assertEqual('task1', tasks[0]['task'])
        self.assertEqual('task2', tasks[1]['task'])
        self.assertEqual('task3', tasks[2]['task'])
        self.assertEqual('task5', tasks[3]['task'])

    def test_if_else_param_false(self):
        os.environ['CONFIG_DIR'] = "test/resources/configs/config_if"

        job_config = JobConfig()

        job = job_config.generate_job("job2", "foo", {"do_task2": False}).chain

        tasks = job.tasks
        self.assertEqual(3, len(tasks))

        self.assertEqual('task1', tasks[0]['task'])
        self.assertEqual('task4', tasks[1]['task'])
        self.assertEqual('task5', tasks[2]['task'])

    def test_if_else_param_not_set(self):
        os.environ['CONFIG_DIR'] = "test/resources/configs/config_if"

        job_config = JobConfig()

        job = job_config.generate_job("job2", "foo").chain

        tasks = job.tasks
        self.assertEqual(3, len(tasks))

        self.assertEqual('task1', tasks[0]['task'])
        self.assertEqual('task4', tasks[1]['task'])
        self.assertEqual('task5', tasks[2]['task'])

    def test_if_not_param_true(self):
        os.environ['CONFIG_DIR'] = "test/resources/configs/config_if"

        job_config = JobConfig()

        job = job_config.generate_job("job3", "foo", {"skip_task2": True}).chain

        tasks = job.tasks
        self.assertEqual(2, len(tasks))

        self.assertEqual('task1', tasks[0]['task'])
        self.assertEqual('task3', tasks[1]['task'])

    def test_if_not_param_false(self):
        os.environ['CONFIG_DIR'] = "test/resources/configs/config_if"

        job_config = JobConfig()

        job = job_config.generate_job("job3", "foo", {"skip_task2": False}).chain

        tasks = job.tasks
        self.assertEqual(3, len(tasks))

        self.assertEqual('task1', tasks[0]['task'])
        self.assertEqual('task2', tasks[1]['task'])
        self.assertEqual('task3', tasks[2]['task'])

    def test_if_not_param_not_set(self):
        os.environ['CONFIG_DIR'] = "test/resources/configs/config_if"

        job_config = JobConfig()

        job = job_config.generate_job("job3", "foo").chain

        tasks = job.tasks
        self.assertEqual(3, len(tasks))

        self.assertEqual('task1', tasks[0]['task'])
        self.assertEqual('task2', tasks[1]['task'])
        self.assertEqual('task3', tasks[2]['task'])

    def test_invalid_request_param(self):
        os.environ['CONFIG_DIR'] = "test/resources/configs/config_if"

        job_config = JobConfig()

        with self.assertRaises(RequestParameterException):
            job_config.generate_job("job1", "foo", {"skip_task2": True})

    def test_invalid_request_param_type(self):
        os.environ['CONFIG_DIR'] = "test/resources/configs/config_if"

        job_config = JobConfig()

        with self.assertRaises(RequestParameterException):
            job_config.generate_job("job1", "foo", {"do_task2": "foo"})
