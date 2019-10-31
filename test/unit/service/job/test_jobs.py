import unittest
import os
import json

from service.job.jobs import IngestJournalsJob, IngestRecordsJob


class JobsTest(unittest.TestCase):
    "Test the available Jobs and validate the parameter payload."

    test_resource_dir = 'test/resources'

    def test_import_records_job(self):
        """Test initialization for record batch import."""
        test_params_path = os.path.join(
            self.test_resource_dir, 'params/book.json')  # TODO

        with open(test_params_path, 'r') as params_file:
            job_params = json.loads(params_file.read())

        additional_object = dict(job_params['objects'][0])

        job_params['objects'] += [additional_object]
        job = IngestRecordsJob(job_params, 'test_user')

        self.assertTrue(type(job.id) == str, 'job id should be generated')
        for chain_id in job.chain_ids:
            self.assertTrue(type(chain_id) == str,
                            'ids for chains should be generated')
        self.assertEqual(len(
            job.chain_ids), 2, 'two chains should be generated, one for each "objects" item')

        chain_length = len(job.chord.tasks[0].tasks)
        self.assertEqual(chain_length, 13,
                         'each default record import chain should consist of 13 subtasks.')

    def test_import_records_job_no_ocr(self):
        """Test OCR option for record batch import."""
        test_params_path = os.path.join(
            self.test_resource_dir, 'params/book.json')

        with open(test_params_path, 'r') as params_file:
            job_params = json.loads(params_file.read())

        job_ocr = IngestRecordsJob(job_params, 'test_user')

        job_params = dict(job_params)
        job_params['options']['do_ocr'] = False

        job_no_ocr = IngestRecordsJob(job_params, 'test_user')

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

        additional_object = dict(job_params['objects'][0])

        job_params['objects'] += [additional_object]
        job = IngestJournalsJob(job_params, 'test_user')

        self.assertTrue(type(job.id) == str, 'job id should be generated')
        for chain_id in job.chain_ids:
            self.assertTrue(type(chain_id) == str,
                            'ids for chains should be generated')
        self.assertEqual(len(
            job.chain_ids), 2, 'two chains should be generated, one for each "objects" item')

        chain_length = len(job.chord.tasks[0].tasks)

        self.assertEqual(chain_length, 13,
                         'each default journal import chain should consist of 13 subtasks.')

    def test_import_journals_job_no_publish(self):
        """Test autopublish option for journal batch import."""
        test_params_path = os.path.join(
            self.test_resource_dir, 'params/journal.json')

        with open(test_params_path, 'r') as params_file:
            job_params = json.loads(params_file.read())

        job_publish = IngestJournalsJob(job_params, 'test_user')

        job_params = dict(job_params)
        job_params['options']['ojs_metadata']['auto_publish_issue'] = False

        job_no_publish = IngestJournalsJob(job_params, 'test_user')

        publish_chain_length = len(job_publish.chord.tasks[0].tasks)
        no_publish_chain_length = len(job_no_publish.chord.tasks[0].tasks)

        self.assertTrue(publish_chain_length == no_publish_chain_length + 1,
                        'the job without publish option should result in a chain one task shorter')

    def test_import_journal_job_no_ocr(self):
        """Test OCR option for journal batch import."""
        test_params_path = os.path.join(
            self.test_resource_dir, 'params/journal.json')

        with open(test_params_path, 'r') as params_file:
            job_params = json.loads(params_file.read())

        job_ocr = IngestJournalsJob(job_params, 'test_user')

        job_params = dict(job_params)
        job_params['options']['do_ocr'] = False

        job_no_ocr = IngestJournalsJob(job_params, 'test_user')

        publish_chain_length = len(job_ocr.chord.tasks[0].tasks)
        no_publish_chain_length = len(job_no_ocr.chord.tasks[0].tasks)

        self.assertTrue(publish_chain_length == no_publish_chain_length + 1,
                        'the job without OCR option should result in a chain one task shorter')
