
import logging

from utils.celery_client import celery_app
from workers.base_task import FileTask

import os.path
from subprocess import run, PIPE, TimeoutExpired

log = logging.getLogger(__name__)

class TimeAnnotateTask(FileTask):

    name = "nlp_heideltime.time_annotate"

    default_timeout_seconds = 60

    default_heideltime_params = [
        "heideltime",
        "-t", "narrative",
        "-dct", "1970-01-01"
    ]

    langs = {
        "de": "german",
        "en": "english",
        "es": "spanish",
        "fr": "french",
        "it": "italian"
    }


    def process_file(self, file, target_dir):
        cmd = self._prepare_heideltime_cmd_params(file)
        annotation_xml = self._run_external_command(cmd)
        target_path = self._determine_new_filename(file, target_dir)
        with open(target_path, mode='wb') as out_file:
            out_file.write(annotation_xml)


    def _prepare_heideltime_cmd_params(self, input_file):
        params = self.default_heideltime_params

        lang_short = self.get_param('lang')
        if lang_short not in self.langs.keys():
            raise ValueError(f'Language code "{lang_short}" is not a valid choice for option "lang".')
        params += ['-l', self.langs[lang_short]]

        if (self.get_param('tag_intervals')):
            params.append('-it')

        params.append(input_file)

        return params


    def _run_external_command(self, params):
        log.debug("Calling: ", " ".join(params))
        # NOTE: Because of the timeout and check parameters, this raises TimeoutExpired and
        # CalledProcessError if the external program takes too long to complete or fails. We
        # do not handle these to intentionally let the job fail at this point.
        exec_result = run(params,
                                stdout=PIPE,
                                stderr=PIPE,
                                check=True,
                                timeout=self.default_timeout_seconds)
        # stdout should be an unencoded binary stream
        return exec_result.stdout


    def _determine_new_filename(self, input_file, target_dir):
        basename, _ = os.path.splitext(os.path.basename(input_file))
        return os.path.join(target_dir, f"{basename}.xml")


TimeAnnotateTask = celery_app.register_task(TimeAnnotateTask())
