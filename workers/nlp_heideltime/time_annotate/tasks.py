
import os.path
import tempfile

from workers.base_task import FileTask
from workers.nlp.formats.xmi import DaiNlpXmiBuilder
from .heideltime_wrapper \
    import HeideltimeCommandParamsBuilder, run_external_command, translate_heideltime_xmi_to_our_xmi


class TimeAnnotateTask(FileTask):

    name = "nlp_heideltime.time_annotate"
    label = "Time Expression Annotation"
    description = "Annotate a textfile using the chronoi heideltime implementation."

    default_timeout_seconds = 180

    def _prepare_heideltime_cmd_params(self, input_file):
        builder = HeideltimeCommandParamsBuilder()
        builder.set_language(self.get_param("lang"))
        builder.set_dct(self.get_param("document_creation_time"))
        builder.set_target_filename(input_file)
        return builder.get_params()

    def _process_txt_file(self, input_path, output_path, builder=None):
        cmd = self._prepare_heideltime_cmd_params(input_path)
        response = run_external_command(cmd, self.default_timeout_seconds)
        response = response.decode(encoding="utf-8")
        xmi = translate_heideltime_xmi_to_our_xmi(response, builder=builder)
        with open(output_path, mode='w') as out_file:
            out_file.write(xmi)

    @staticmethod
    def _setup_temp_file(content: str):
        file = tempfile.NamedTemporaryFile(mode="w+", encoding="utf8", delete=True)
        file.write(content)
        file.flush()
        return file

    def process_file(self, file, target_dir):
        target_path = self.default_target_name(file, target_dir, 'xmi')
        _, extension = os.path.splitext(file)
        if extension in ['.txt', '.TXT']:
            self._process_txt_file(file, target_path)
        elif extension in ['.xmi', '.XMI']:
            with open(file, 'rb') as f:
                builder = DaiNlpXmiBuilder(xmi=f)
            # the temporary file is destroyed, whten the "with" closes it
            with self._setup_temp_file(builder.get_sofa()) as input_file:
                self._process_txt_file(input_file.name, target_path, builder=builder)
        else:
            raise Exception('Unknown extension: %s' % extension)
