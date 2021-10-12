
import os
import unittest
from subprocess import TimeoutExpired, CalledProcessError

from test.nlp_worker.unit.test_annotate import AssertsXmiCanBeLoadedWithDaiTypesystem
from workers.nlp.formats.xmi import Annotation, DaiNlpXmiBuilder
from workers.nlp_heideltime.time_annotate.heideltime_wrapper \
    import HeideltimeCommandParamsBuilder, run_external_command, translate_heideltime_xmi_to_our_xmi


class TranslateHeideltimeXmiToDaiXmiTest(unittest.TestCase, AssertsXmiCanBeLoadedWithDaiTypesystem):

    @staticmethod
    def _heideltime_sample_xmi() -> str:
        path = os.path.join(os.environ['TEST_RESOURCE_DIR'], 'files', 'examples_xmi', 'example_output_heideltime.xmi')
        with open(path, 'r', encoding='utf-8') as file:
            return file.read()

    def _assert_heideltime_sample_xmi_tags_present(self, cas):
        timexes = list(cas.select(Annotation.timex.value))
        self.assertEqual(len(timexes), 1, "Should have converted one timex.")
        timex = timexes[0]
        self.assertEqual(timex.begin, 17)
        self.assertEqual(timex.end, 21)
        self.assertEqual(timex.get_covered_text(), "2006")
        self.assertEqual(timex.timexValue, "2006")
        self.assertEqual(timex.timexMod, "")

        temponyms = list(cas.select(Annotation.temponym.value))
        self.assertEqual(len(temponyms), 1, 'Should have converted one temponym.')
        temponym = temponyms[0]
        self.assertEqual(temponym.begin, 54)
        self.assertEqual(temponym.end, 71)
        self.assertEqual(temponym.get_covered_text(), 'Abbasid Caliphate')
        self.assertListEqual(temponym.references, ['http://chronontology.dainst.org/period/2O4ZL19IMOGo'])
        self.assertEqual(temponym.earliestBegin, '+0750')
        self.assertEqual(temponym.latestBegin, '+0750')
        self.assertEqual(temponym.earliestEnd, '+0772')
        self.assertEqual(temponym.latestEnd, '+0772')

    def test_conversion_returns_xmi_with_correct_entities(self):
        result = translate_heideltime_xmi_to_our_xmi(self._heideltime_sample_xmi())
        self.assertIsInstance(result, str, 'Should return a string')
        cas = self.assert_xmi_can_be_loaded_with_dai_typesystem(result)
        self._assert_heideltime_sample_xmi_tags_present(cas)

    def test_conversion_with_previous_xmi_builder(self):
        builder = DaiNlpXmiBuilder('test')
        builder.set_sofa("\nThat happend in 2006.\n\nSomething happened during the Abbasid Caliphate.\n")
        builder.add_annotation(Annotation.page, start=0, end=23)

        result = translate_heideltime_xmi_to_our_xmi(self._heideltime_sample_xmi(), builder=builder)
        self.assertIsInstance(result, str, 'Should return a string')
        cas = self.assert_xmi_can_be_loaded_with_dai_typesystem(result)
        self._assert_heideltime_sample_xmi_tags_present(cas)

        pages = list(cas.select(Annotation.page.value))
        self.assertEqual(len(pages), 1, 'The page element should still be present.')
        self.assertEqual(pages[0].begin, 0)
        self.assertEqual(pages[0].end, 23)


class ExternalCommandTest(unittest.TestCase):

    def test_command_returns_correct_output(self):
        test_str = "Testing 1,2,3..."
        cmd = ["echo", test_str]
        output = run_external_command(cmd)
        self.assertEqual(output.decode('utf-8').rstrip(), test_str)

    def test_timeout_fails_command(self):
        cmd = ["sleep", "1"]
        timeout = 0.01
        self.assertRaises(TimeoutExpired, run_external_command, cmd, timeout)

    def test_bad_return_code_raises_exception(self):
        cmd = ["/bin/false"]
        self.assertRaises(CalledProcessError, run_external_command, cmd)

    def test_invalid_input_fails_with_some_kind_of_exception(self):
        self.assertRaises(Exception, run_external_command, ["command-does-not-exist"])
        self.assertRaises(Exception, run_external_command, [])


class HeideltimeParamsTest(unittest.TestCase):

    def _params_count(self):
        return len(self.builder.get_params())

    def _init_builder(self):
        self.builder = HeideltimeCommandParamsBuilder()
        return self.builder

    def test_lang_param_valid(self):
        builder = self._init_builder()
        count = self._params_count()

        builder.set_language("english")

        self.assertEqual(self._params_count(), count + 2, "Should increase params by two")
        self.assertTrue("english" in builder.get_params(), "Should have the language set.")

        builder.set_language("german")
        self.assertEqual(self._params_count(), count + 2, "Should not change count on resetting param.")
        self.assertTrue("german" in builder.get_params(), "Should have changed the language.")

        builder.set_language("en")
        self.assertTrue("english" in builder.get_params(), "Should be able to set lang by short code.")

    def test_lang_param_invalid(self):
        builder = self._init_builder()
        self.assertRaises(ValueError, builder.set_language, "")
        self.assertRaises(ValueError, builder.set_language, "abcd")
        self.assertRaises(ValueError, builder.set_language, "Klingon")

    def test_dct_param_valid(self):
        builder = self._init_builder()
        builder.set_dct("1970-01-01")
        self.assertTrue("1970-01-01" in builder.get_params())

    def test_dct_param(self):
        builder = self._init_builder()
        self.assertRaises(ValueError, builder.set_dct, "")
        self.assertRaises(ValueError, builder.set_dct, "abcdefg")
        self.assertRaises(ValueError, builder.set_dct, "01-01-1970")
        self.assertRaises(ValueError, builder.set_dct, "1999-02-29")


    def test_filename_is_last_param(self):
        filename = "some_file.txt"
        builder = self._init_builder()
        builder.set_target_filename(filename)
        self.assertEqual(filename, builder.get_params()[-1], "Should set filename as last param.")

        builder.set_language("de")
        builder.set_dct("1968-05-23")
        self.assertEqual(filename, builder.get_params()[-1],
                         "Should have filename as last param after setting other setting.")
