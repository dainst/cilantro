
from utils.celery_client import celery_app
from workers.base_task import FileTask

import os.path

from .timeml_to_viewer_json import convert_timeml_to_annotation_json
from .time_annotate import HeideltimeCommandParamsBuilder, run_external_command


def _determine_new_filename(input_file, target_dir, append_str):
    basename, _ = os.path.splitext(os.path.basename(input_file))
    return os.path.join(target_dir, f"{basename}{append_str}")


class ConvertTimeMLToViewerJsonTask(FileTask):

    name = "nlp_heideltime.convert_timeml_to_viewer_json"
    label = "TimeML to Viewer JSON"
    description = "Convert TimeML/TIMEX3 DATEs to annotations shown with the pdf viewer."

    def process_file(self, file, target_dir):
        target_file = _determine_new_filename(file, target_dir, "-annotations-time-expression.json")
        convert_timeml_to_annotation_json(file, target_file)


ConvertTimeMLToViewerJsonTask = celery_app.register_task(ConvertTimeMLToViewerJsonTask())


class TimeAnnotateTask(FileTask):

    name = "nlp_heideltime.time_annotate"
    label = "Time Expression Annotation"
    description = "Annotate a textfile using the chronoi heideltime implementation."

    default_timeout_seconds = 180

    def process_file(self, file, target_dir):
        cmd = self._prepare_heideltime_cmd_params(file)
        print(cmd)
        annotation_xml = run_external_command(cmd, self.default_timeout_seconds)
        target_path = _determine_new_filename(file, target_dir, ".xml")
        with open(target_path, mode='wb') as out_file:
            out_file.write(annotation_xml)

    def _prepare_heideltime_cmd_params(self, input_file):
        builder = HeideltimeCommandParamsBuilder()
        builder.set_language(self.get_param("lang"))
        builder.set_dct(self.get_param("document_creation_time"))
        builder.set_interval_tagging(self.get_param("tag_intervals"))
        builder.set_target_filename(input_file)
        return builder.get_params()


TimeAnnotateTask = celery_app.register_task(TimeAnnotateTask())
