import uuid
import logging

from abc import abstractmethod
from celery import chord, signature

from utils.celery_client import celery_app
from utils.job_db import JobDb


class BaseJob:
    """Wraps multiple celery task chains as a celery chord and handles ID generation."""

    logger = logging.getLogger(__name__)

    @property
    def job_type(self):
        raise NotImplementedError

    @property
    def label(self):
        raise NotImplementedError

    @property
    def description(self):
        raise NotImplementedError

    def __init__(self):
        self.job_db = JobDb()

    @abstractmethod
    def run(self):
        """
        Trigger asynchronous execution of the job.

        :return AsyncResult: Celery result
        """
        raise NotImplementedError("run method not implemented")

    @abstractmethod
    def _add_to_job_db(self, params, user_name):
        raise NotImplementedError("_add_to_job_db method not implemented")


class BatchJob(BaseJob):

    @abstractmethod
    def _create_chains(self, params, user_name):
        raise NotImplementedError("_create_chains method not implemented")

    def __init__(self, params, user_name):
        """
        Create a job chord and triggers ID generation.

        :param List[chain] chains: A list of celery task chains
        """
        super().__init__()
        self.id = _generate_id()

        chains = self._create_chains(params, user_name)

        # Once all job chains have finished within this chord, we have to
        # trigger a callback worker in order to update the database entry
        # for the chord job itself.
        self.chord = chord(chains, signature(
            'finish_chord', kwargs={'job_id': self.id, 'work_path': self.id}))

        self.chain_ids = self._add_to_job_db(params, user_name)

        self.logger.debug(f"created job chord with id: {self.id}: ")
        for (index, chain_id) in enumerate(self.chain_ids, 1):
            self.logger.debug(
                f'  chain #{index}, job id: {chain_id}:')

    def run(self):
        self.job_db.update_job_state(self.id, 'started')
        for chain_id in self.chain_ids:
            self.job_db.update_job_state(chain_id, 'started')

        self.chord.apply_async(task_id=self.id)

    def _add_to_job_db(self, params, user_name):
        chain_ids = []

        for idx, current_chain in enumerate(self.chord.tasks):
            current_chain_links = []
            current_chain_id = _generate_id()
            current_work_path = current_chain_id
            current_chain.kwargs['work_path'] = current_work_path

            for single_task in current_chain.tasks:
                job_id = _generate_id()

                single_task.kwargs['job_id'] = job_id
                single_task.options['task_id'] = job_id
                single_task.kwargs['work_path'] = current_work_path
                single_task.kwargs['parent_job_id'] = current_chain_id

                self.job_db.add_job(job_id=job_id,
                                    user=user_name,
                                    job_type=single_task.name,
                                    parent_job_id=current_chain_id,
                                    child_job_ids=[],
                                    parameters=single_task.kwargs)

                current_chain_links += [job_id]

            self.job_db.add_job(job_id=current_chain_id,
                                user=user_name,
                                job_type='chain',
                                parent_job_id=self.id,
                                child_job_ids=current_chain_links,
                                parameters={
                                    'work_path': current_chain.kwargs['work_path']},
                                label=f"Batch #{idx+1}",
                                description="Group containing all the individual steps for a single batch.")
            chain_ids += [current_chain_id]

        self.job_db.add_job(job_id=self.id,
                            user=user_name,
                            job_type=self.job_type,
                            parent_job_id=None,
                            child_job_ids=chain_ids,
                            parameters=params,
                            label=self.label,
                            description=self.description)

        return chain_ids


class IngestArchivalMaterialsJob(BatchJob):
    job_type = 'ingest_archival_material'
    label = 'Retrodigitized Archival Material'
    description = "Import multiple folders that contain scans of archival material into iDAI.archives / AtoM."

    def _create_chains(self, params, user_name):
        chains = []

        for record_object in params['objects']:
            task_params = dict(**record_object, **{'user': user_name},
                               initial_representation='tif')

            current_chain = _link('create_object', **task_params)

            current_chain |= _link('list_files',
                                   representation='tif',
                                   target='jpg',
                                   task='convert.tif_to_jpg')

            current_chain |= _link('list_files',
                                   representation='jpg',
                                   target='jpg_thumbnails',
                                   task='convert.tif_to_jpg',
                                   max_width=50,
                                   max_height=50)

            current_chain |= _link('list_files',
                                   representation='tif',
                                   target='ptif',
                                   task='convert.tif_to_ptif')

            current_chain |= _link('list_files',
                                   representation='tif',
                                   target='pdf',
                                   task='convert.tif_to_pdf')
            current_chain |= _link('convert.merge_converted_pdf')

            if params['options']['do_ocr']:
                current_chain |= _link('list_files',
                                       representation='tif',
                                       target='txt',
                                       task='convert.tif_to_txt',
                                       ocr_lang=params['options']['ocr_lang'])

            current_chain |= _link('generate_xml',
                                   template_file='mets_template_no_articles.xml',
                                   target_filename='mets.xml',
                                   schema_file='mets.xsd')

            current_chain |= _link('publish_to_repository')
            current_chain |= _link('publish_to_atom')
            current_chain |= _link('publish_to_archive')

            current_chain |= _link('cleanup_workdir')
            current_chain |= _link('finish_chain')

            chains.append(current_chain)

        return chains


class IngestJournalsJob(BatchJob):
    job_type = 'ingest_journals'
    label = 'Retrodigitized Journals'
    description = "Import multiple folders that contain scans of journal issues into iDAI.publications / OJS."

    def _create_chains(self, params, user_name):
        chains = []

        for issue_object in params['objects']:
            task_params = dict(**issue_object, **{'user': user_name},
                               initial_representation='tif')

            current_chain = _link('create_object', **task_params)

            current_chain |= _link('list_files',
                                   representation='tif',
                                   target='pdf',
                                   task='convert.tif_to_pdf')

            current_chain |= _link('convert.merge_converted_pdf')

            current_chain |= _link('list_files',
                                   representation='tif',
                                   target='jpg',
                                   task='convert.tif_to_jpg')

            current_chain |= _link('list_files',
                                   representation='tif',
                                   target='jpg_thumbnails',
                                   task='convert.scale_image',
                                   max_width=50,
                                   max_height=50)

            current_chain |= _link('generate_xml',
                                   template_file='ojs3_template_issue.xml',
                                   target_filename='ojs_import.xml',
                                   ojs_metadata=params['options']['ojs_metadata'])

            current_chain |= _link('generate_xml',
                                   template_file='mets_template_no_articles.xml',
                                   target_filename='mets.xml',
                                   schema_file='mets.xsd')
            if params['options']['do_ocr']:
                current_chain |= _link('list_files',
                                       representation='tif',
                                       target='txt',
                                       task='convert.tif_to_txt',
                                       ocr_lang=params['options']['ocr_lang'])

            if params['options']['ojs_metadata']['auto_publish_issue']:
                current_chain |= _link('publish_to_ojs',
                                       ojs_metadata=params['options']['ojs_metadata'],
                                       ojs_journal_code=issue_object['metadata']['ojs_journal_code'])
            current_chain |= _link('publish_to_repository')
            current_chain |= _link('publish_to_archive')
            current_chain |= _link('cleanup_workdir')
            current_chain |= _link('finish_chain')
            chains.append(current_chain)

        return chains


def _link(name, **params):
    return celery_app.signature(name, kwargs=params)


def _generate_id():
    return str(uuid.uuid1())
