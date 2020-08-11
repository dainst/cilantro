
from utils.celery_client import celery_app
from workers.base_task import FileTask

import os.path

from .heideltime_wrapper \
    import HeideltimeCommandParamsBuilder, run_external_command, translate_heideltime_xmi_to_our_xmi


def _determine_new_filename(input_file, target_dir, append_str):
    basename, _ = os.path.splitext(os.path.basename(input_file))
    return os.path.join(target_dir, f"{basename}{append_str}")


class TimeAnnotateTask(FileTask):

    name = "nlp_heideltime.time_annotate"
    label = "Time Expression Annotation"
    description = "Annotate a textfile using the chronoi heideltime implementation."

    default_timeout_seconds = 180

    def process_file(self, file, target_dir):
        cmd = self._prepare_heideltime_cmd_params(file)
        response = run_external_command(cmd, self.default_timeout_seconds)
        response = response.decode(encoding="utf-8")
        xmi = translate_heideltime_xmi_to_our_xmi(response)
        target_path = _determine_new_filename(file, target_dir, ".xml")
        with open(target_path, mode='w') as out_file:
            out_file.write(xmi)

    def _prepare_heideltime_cmd_params(self, input_file):
        builder = HeideltimeCommandParamsBuilder()
        builder.set_language(self.get_param("lang"))
        builder.set_dct(self.get_param("document_creation_time"))
        builder.set_interval_tagging(self.get_param("tag_intervals"))
        builder.set_target_filename(input_file)
        return builder.get_params()


TimeAnnotateTask = celery_app.register_task(TimeAnnotateTask())
