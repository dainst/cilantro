
import datetime
import logging
import os
from subprocess import run, PIPE, SubprocessError

import cassis

from workers.nlp.formats.xmi import DaiNlpXmiBuilder

log = logging.getLogger(__name__)


def run_external_command(params, timeout_after_secs=None):
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


def translate_heideltime_xmi_to_our_xmi(xmi_str: str) -> str:
    file = os.path.join(os.environ['RESOURCES_DIR'], 'nlp_typesystem_heideltime.xml')
    with open(file, 'rb') as f:
        typesystem = cassis.load_typesystem(f)
    cas = cassis.load_cas_from_xmi(xmi_str, typesystem=typesystem)

    builder = DaiNlpXmiBuilder("chronoi-heideltime")
    builder.set_sofa(cas.sofa_string)

    # translate timexes of type DATE
    for annotation in cas.select("de.unihd.dbs.uima.types.heideltime.Timex3"):
        if annotation.timexType == "DATE":
            args = dict(
                type_name="org.dainst.nlp.NamedEntity.TimexDate",
                start=annotation.begin,
                end=annotation.end,
                timexValue=annotation.timexValue,
                timexMod=annotation.timexMod
            )
            builder.add_annotation(**args)

    # translate intervals of type TEMPONYM
    for annotation in cas.select("de.unihd.dbs.uima.types.heideltime.Timex3Interval"):
        if annotation.timexType == "TEMPONYM":
            args = dict(
                type_name="org.dainst.nlp.NamedEntity.Temponym",
                start=annotation.begin,
                end=annotation.end,
                references=(annotation.ref.split(';') if annotation.ref else []),
                earliestBegin=annotation.TimexValueEB,
                latestBegin=annotation.TimexValueLB,
                earliestEnd=annotation.TimexValueEE,
                latestEnd=annotation.TimexValueLE
            )
            builder.add_annotation(**args)

    return builder.xmi()


class HeideltimeCommandParamsBuilder(object):

    _langs = {
        "de": "german",
        "en": "english",
        "es": "spanish",
        "fr": "french",
        "it": "italian"
    }

    def __init__(self):
        self.params = [
            "heideltime",
            "-t", "narrative",
        ]
        self.filename = ""

    def _set_param_value(self, short_code, value):
        try:
            idx = self.params.index(short_code)
            self.params[idx + 1] = value
        except ValueError:
            self.params += [short_code, value]
        return self

    def _set_bool_param(self, short_code, value):
        try:
            self.params.remove(short_code)
        except ValueError:
            pass
        if value:
            self.params.append(short_code)
        return self

    def set_language(self, lang):
        return self._set_param_value("-l", self._valid_lang(lang))

    def set_dct(self, dct):
        return self._set_param_value("-dct", self._valid_dct(dct))

    def set_target_filename(self, filename):
        self.filename = filename
        return self

    def set_interval_tagging(self, boolean_val):
        self._set_bool_param("-it", self._valid_bool(boolean_val))

    def get_params(self):
        return self.params + [self.filename]

    def _valid_lang(self, lang):
        if lang in self._langs.values():
            return lang
        elif lang in self._langs.keys():
            return self._langs[lang]
        else:
            raise ValueError(f'Language "{lang}" is not a valid choice for the language option.')

    @classmethod
    def _valid_dct(cls, dct):
        try:
            datetime.datetime.strptime(dct, "%Y-%m-%d").date()
        except ValueError:
            raise ValueError(f"Document creation time should be in ISO-Format: YYYY-MM-DD, is: '{dct}'")
        return dct

    @classmethod
    def _valid_bool(cls, maybe_bool):
        if not isinstance(maybe_bool, bool):
            raise ValueError(f"Not a boolean: '{maybe_bool}'")
        return maybe_bool
