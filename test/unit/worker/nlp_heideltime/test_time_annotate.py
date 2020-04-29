
import unittest

from workers.nlp_heideltime.time_annotate.time_annotate import HeideltimeCommandParamsBuilder
from workers.nlp_heideltime.time_annotate.time_annotate import run_external_command

from subprocess import TimeoutExpired, CalledProcessError


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

    def test_interval_tagging_param_valid(self):
        builder = self._init_builder()
        builder.set_interval_tagging(False)
        self.assertTrue("-it" not in builder.get_params(), "False shouldn't toggle param.")

        builder.set_interval_tagging(True)
        self.assertTrue("-it" in builder.get_params(), "True should toggle param.")

        builder.set_interval_tagging(False)
        self.assertTrue("-it" not in builder.get_params(), "False should disable param.")

    def test_interval_tagging_param_invalid(self):
        builder = self._init_builder()
        self.assertRaises(ValueError, builder.set_interval_tagging, None)
        self.assertRaises(ValueError, builder.set_interval_tagging, "")
        self.assertRaises(ValueError, builder.set_interval_tagging, "True")
        self.assertRaises(ValueError, builder.set_interval_tagging, "False")

    def test_filename_is_last_param(self):
        filename = "some_file.txt"
        builder = self._init_builder()
        builder.set_target_filename(filename)
        self.assertEqual(filename, builder.get_params()[-1], "Should set filename as last param.")

        builder.set_interval_tagging(True)
        builder.set_language("de")
        builder.set_dct("1968-05-23")
        self.assertEqual(filename, builder.get_params()[-1],
                         "Should have filename as last param after setting other setting.")
