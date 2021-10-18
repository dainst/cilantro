import unittest
import os
import json

from service.job.jobs import IngestJournalsJob, IngestArchivalMaterialsJob, IngestMonographsJob


class JobsTest(unittest.TestCase):
    "Test the available Jobs and validate the parameter payload."

    test_resource_dir = 'test/resources'

    def test_import_archival_material_job(self):
        """Test initialization for archival material batch import."""
        test_params_path = os.path.join(
            self.test_resource_dir, 'params/archival_material.json')

        with open(test_params_path, 'r') as params_file:
            job_params = json.loads(params_file.read())

        additional_object = dict(job_params['targets'][0])

        job_params['targets'] += [additional_object]
        job = IngestArchivalMaterialsJob(job_params, 'test_user')

        self.assertTrue(type(job.id) == str, 'job id should be generated')
        for chain_id in job.chain_ids:
            self.assertTrue(type(chain_id) == str,
                            'ids for chains should be generated')
        self.assertEqual(len(
            job.chain_ids), 2, 'two chains should be generated, one for each "targets" item')

        chain_length = len(job.chord.tasks[0].tasks)
        self.assertEqual(chain_length, 13,
                         'each default archival material import chain should consist of 14 subtasks.')

    def test_import_journals_job(self):
        """Test initialization for journal batch import."""
        test_params_path = os.path.join(
            self.test_resource_dir, 'params/journal.json')

        with open(test_params_path, 'r') as params_file:
            job_params = json.loads(params_file.read())

        additional_object = dict(job_params['targets'][0])

        job_params['targets'] += [additional_object]
        job = IngestJournalsJob(job_params, 'test_user')

        self.assertTrue(type(job.id) == str, 'job id should be generated')
        for chain_id in job.chain_ids:
            self.assertTrue(type(chain_id) == str,
                            'ids for chains should be generated')
        self.assertEqual(len(
            job.chain_ids), 2, 'two chains should be generated, one for each "targets" item')

        chain_length = len(job.chord.tasks[0].tasks)

        self.assertEqual(chain_length, 12,
                         'each default journal import chain should consist of 13 subtasks.')

    def test_import_monographs_job(self):
        """Test initialization for monographs batch import."""
        test_params_path = os.path.join(
            self.test_resource_dir, 'params/monograph.json')

        with open(test_params_path, 'r') as params_file:
            job_params = json.loads(params_file.read())

        additional_object = dict(job_params['targets'][0])

        job_params['targets'] += [additional_object]
        job = IngestMonographsJob(job_params, 'test_user')

        self.assertTrue(type(job.id) == str, 'job id should be generated')
        for chain_id in job.chain_ids:
            self.assertTrue(type(chain_id) == str,
                            'ids for chains should be generated')
        self.assertEqual(len(
            job.chain_ids), 2, 'two chains should be generated, one for each "targets" item')

        chain_length = len(job.chord.tasks[0].tasks)

        self.assertEqual(chain_length, 12,
                         'each default monograph import chain should consist of 13 subtasks.')

