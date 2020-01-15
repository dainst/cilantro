
import logging

from utils.celery_client import celery_app
from workers.base_task import FileTask

import datetime
import os.path
from subprocess import run, PIPE, SubprocessError

from .viewer_json import convert_timeml_to_annotation_json

log = logging.getLogger(__name__)


class ConvertTimeMLToViewerJsonTask(FileTask):

    name = "nlp_heideltime.convert_timeml_to_viewer_json"
    label = "TimeML to Viewer JSON"
    description = "Convert TimeML/TIMEX3 DATEs to annotations shown with the pdf viewer."

    def process_file(self, file, target_dir):
        target_file = os.path.join(target_dir, "annotation-time-expressions.json")
        convert_timeml_to_annotation_json(file, target_file)


ConvertTimeMLToViewerJsonTask = celery_app.register_task(ConvertTimeMLToViewerJsonTask())


class TimeAnnotateTask(FileTask):

    name = "nlp_heideltime.time_annotate"
    label = "Time Expression Annotation"
    description = "Annotate a textfile using the chronoi heideltime implementation."

    _default_timeout_seconds = 180

    _default_heideltime_params = [
        "heideltime",
        "-t", "narrative",
    ]

    _langs = {
        "de": "german",
        "en": "english",
        "es": "spanish",
        "fr": "french",
        "it": "italian"
    }

    def process_file(self, file, target_dir):
        cmd = self._prepare_heideltime_cmd_params(file)
        annotation_xml = self._run_external_command(cmd, self._default_timeout_seconds)
        target_path = self._determine_new_filename(file, target_dir)
        with open(target_path, mode='wb') as out_file:
            out_file.write(annotation_xml)

    def _prepare_heideltime_cmd_params(self, input_file):
        params = self._default_heideltime_params

        params += ['-l', self._prepare_lang_param()]
        params += ['-dct', self._prepare_dct_param()]
        if self.get_param('tag_intervals'):
            params.append('-it')

        params.append(input_file)
        return params

    def _prepare_lang_param(self):
        lang_short = self.get_param('lang')
        if lang_short not in self._langs.keys():
            raise ValueError(f'Language code "{lang_short}" is not a valid choice for option "lang".')
        return self._langs[lang_short]

    def _prepare_dct_param(self):
        iso_date_string = self.get_param('document_creation_time')
        # this should raise a ValueError if the string is not a valid date
        date_obj = datetime.datetime.strptime(iso_date_string, "%Y-%m-%d").date()
        if type(date_obj) is datetime.date:
            # return the string as we are now sure that it is in valid format
            return iso_date_string
        else:
            raise ValueError(f"Cannot convert date: {iso_date_string}")

    def _run_external_command(self, params, timeout_after_secs):
        log.debug("Calling: ", " ".join(params))
        try:
            # When calling the command, redirect stdout and stderr to separate pipes,
            # raise exceptions in case of a non-zero return code or after the timeout passes.
            result = run(params, stdout=PIPE, stderr=PIPE, check=True, timeout=timeout_after_secs)
        except SubprocessError as e:
            # Either a TimeoutExpired or a CalledProcessError.
            # In any case we dump stderr as that is not included in the exception messages.
            if hasattr(e, 'stderr') and e.stderr is not None:
                log.error("Call to external program failed. Dumping stderr:")
                log.error(e.stderr)
            # re-raise to fail this task
            raise e
        if result is not None and result.stdout is not None:
            return result.stdout
        else:
            return ""

    def _determine_new_filename(self, input_file, target_dir):
        basename, _ = os.path.splitext(os.path.basename(input_file))
        return os.path.join(target_dir, f"{basename}.xml")


TimeAnnotateTask = celery_app.register_task(TimeAnnotateTask())
