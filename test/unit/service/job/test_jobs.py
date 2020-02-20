import unittest
import os
import json

from service.job.jobs import IngestJournalsJob, IngestArchivalMaterialsJob


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
        self.assertEqual(chain_length, 14,
                         'each default archival material import chain should consist of 14 subtasks.')

    def test_import_archival_material_job_no_ocr(self):
        """Test OCR option for archival material batch import."""
        test_params_path = os.path.join(
            self.test_resource_dir, 'params/archival_material.json')

        with open(test_params_path, 'r') as params_file:
            job_params = json.loads(params_file.read())

        job_ocr = IngestArchivalMaterialsJob(job_params, 'test_user')

        job_params = dict(job_params)
        job_params['options']['do_ocr'] = False

        job_no_ocr = IngestArchivalMaterialsJob(job_params, 'test_user')

        publish_chain_length = len(job_ocr.chord.tasks[0].tasks)
        no_publish_chain_length = len(job_no_ocr.chord.tasks[0].tasks)

        self.assertTrue(publish_chain_length == no_publish_chain_length + 1,
                        'the job without ocr option should result in a chain one task shorter')

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

        self.assertEqual(chain_length, 11,
                         'each default journal import chain should consist of 11 subtasks.')



    def test_import_journal_job_no_ocr(self):
        """Test OCR option for journal batch import."""
        test_params_path = os.path.join(
            self.test_resource_dir, 'params/journal.json')

        with open(test_params_path, 'r') as params_file:
            job_params = json.loads(params_file.read())

        job_ocr = IngestJournalsJob(job_params, 'test_user')

        job_params = dict(job_params)
        job_params['options']['ocr_options']['do_ocr'] = False

        job_no_ocr = IngestJournalsJob(job_params, 'test_user')

        publish_chain_length = len(job_ocr.chord.tasks[0].tasks)
        no_publish_chain_length = len(job_no_ocr.chord.tasks[0].tasks)

        self.assertTrue(publish_chain_length == no_publish_chain_length + 1,
                        'the job without OCR option should result in a chain one task shorter')
