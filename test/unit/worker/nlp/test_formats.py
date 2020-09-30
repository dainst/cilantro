

import json
import os.path
import unittest
from io import BytesIO

from lxml import etree

from workers.nlp.formats.book_viewer_json import BookViewerJsonBuilder, Kind
from workers.nlp.formats.xmi import DaiNlpXmiReader, DaiNlpXmiBuilder, DaiNlpFormatError

resources_dir = os.environ["RESOURCES_DIR"]
path_typesystem_dai = os.path.join(resources_dir, "nlp_typesystem_dai.xml")


class XPathAsserting:

    @staticmethod
    def _eval_xpath(xml: str, xpath: str, **kwargs):
        return etree.parse(BytesIO(xml.encode("utf-8"))).xpath(xpath, **kwargs)

    def assert_xpath_present(self, xml: str, xpath, **kwargs):
        result = self._eval_xpath(xml, xpath, **kwargs)
        error = ""
        # list, bool, str, float are the possible return types
        # as per lxml's documentation
        if isinstance(result, list) and len(result) == 0:
            error = "Empty list."
        elif isinstance(result, bool) and not result:
            error = "False."
        elif isinstance(result, str) and len(result) == 0:
            error = "Empty string."
        elif isinstance(result, float):
            pass
        else:
            "Unknown return type."
        if error:
            raise AssertionError(f"XPath {xpath} returned: {error}")
        pass

    def assert_xpath_exactly_n_times(self, xml: str, xpath: str, n: int, **kwargs):
        result = self._eval_xpath(xml, xpath, **kwargs)
        if not isinstance(result, list):
            raise AssertionError(f"XPath does not return a list: '{xpath}' returns: {result}")
        if not len(result) == n:
            raise AssertionError(f"Xpath returns {len(result)} times, expected: {n}, is: '{xpath}'")

    def assert_xpath_exactly_once(self, xml: str, xpath: str, **kwargs):
        self.assert_xpath_exactly_n_times(xml=xml, xpath=xpath, n=1, **kwargs)


class DaiNlpXmiReaderTest(unittest.TestCase):

    empty_input = """<?xml version='1.0' encoding='ASCII'?>
        <xmi:XMI xmlns:xmi="http://www.omg.org/XMI" xmlns:cas="http:///uima/cas.ecore" xmlns:LayoutElement="http:///org/dainst/nlp/LayoutElement.ecore" xmi:version="2.0">
          <cas:NULL xmi:id="0"/>
          <cas:Sofa xmi:id="1" sofaNum="1" sofaID="_InitialView" mimeType="None" sofaString="Perikles war ein Grieche. Genauso wie Aristoteles aus Athen."/>
          <cas:View sofa="1" members=""/>
        </xmi:XMI>
        """

    def test_get_sofa(self):
        reader = DaiNlpXmiReader(xmi=self.empty_input)
        expected_sofa = 'Perikles war ein Grieche. Genauso wie Aristoteles aus Athen.'
        self.assertEqual(reader.get_sofa(), expected_sofa)


class DaiNlpXmiBuilderTest(unittest.TestCase, XPathAsserting):

    text = 'Perikles war ein Grieche. Genauso wie Aristoteles aus Stageira.'

    annotator = 'unittest-annotator'

    ns = {'nlp': 'http:///org/dainst/nlp.ecore'}

    entity_args = dict(type_name='org.dainst.nlp.NamedEntity', start=0, end=7)

    def setUp(self) -> None:
        self.builder = DaiNlpXmiBuilder(default_annotator_id=self.annotator)
        self.builder.set_sofa(self.text)

    def test_cannot_change_sofa_once_set(self):
        with self.assertRaises(DaiNlpFormatError):
            self.builder.set_sofa('xyz')

    def test_can_add_simple_annotation(self):
        self.builder.add_annotation(**self.entity_args)
        self.assert_xpath_exactly_once(self.builder.xmi(), '//nlp:NamedEntity[@begin=0 and @end=7]',
                                       namespaces=self.ns)

    def test_setting_the_default_annotator_id_works(self):
        # using the default annotator defined during setup
        self.builder.add_annotation(**self.entity_args)
        self.assert_xpath_exactly_once(self.builder.xmi(), f"//nlp:NamedEntity[@annotatorId='{self.annotator}']",
                                       namespaces=self.ns)
        # changing the id should change it for the next annotation in the xmi
        self.builder.default_annotator_id = 'xyz'
        self.builder.add_annotation(**self.entity_args)
        self.assert_xpath_exactly_once(self.builder.xmi(), "//nlp:NamedEntity[@annotatorId='xyz']",
                                       namespaces=self.ns)

    def test_can_add_annotation_with_references(self):
        args = dict(
            **self.entity_args,
            references=[
                'https://example.com/ref1',
                'https://example.com/ref2'
            ]
        )
        self.builder.add_annotation(**args)
        for ref in args["references"]:
            with self.subTest(ref=ref):
                self.assert_xpath_exactly_once(self.builder.xmi(), f"//references[text()='{ref}']",
                                               namespaces=self.ns)

    def test_setting_an_annotator_id_works(self):
        args = dict(**self.entity_args, annotatorId='custom')
        self.builder.add_annotation(**args)
        self.assert_xpath_exactly_once(self.builder.xmi(), "//nlp:NamedEntity[@annotatorId='custom']",
                                       namespaces=self.ns)

    def test_fails_when_annotator_id_set_empty_on_annotation(self):
        args = dict(**self.entity_args, annotatorId='')
        with self.assertRaises(DaiNlpFormatError):
            self.builder.add_annotation(**args)

    def test_cannot_add_attributes_not_defined_in_typesystem(self):
        args = dict(**self.entity_args, fail_attr="some_value")
        with self.assertRaises(DaiNlpFormatError):
            self.builder.add_annotation(**args)

    def test_cannot_add_empty_or_bogus_annotation_type(self):
        for name in ['', 'bogusEntity']:
            with self.subTest(name=name):
                args = {**self.entity_args, 'type_name': name}
                with self.assertRaises(DaiNlpFormatError):
                    self.builder.add_annotation(**args)


class BookViewerJsonTest(unittest.TestCase):

    def setUp(self) -> None:
        self.builder = BookViewerJsonBuilder()
        self.builder.add_occurence(Kind.location, "Rom", page=2, term="Roma")
        self.builder.add_occurence(Kind.location, "Rom", page=3, term="Roms")
        self.builder.add_occurence(Kind.location, "Rom", page=2, term="Rom")
        self.builder.add_occurence(Kind.location, "Athen", page=4, term="Athen")

    def _result(self):
        return json.loads(self.builder.to_json())

    def _location_items(self):
        # return the location items as tuple: (rome, athens)
        locations = self._result()['locations']['items']
        if locations[0]['lemma'] != 'Rom':
            locations = reversed(locations)
        return tuple(locations)

    def _rome(self):
        return self._location_items()[0]

    def test_adding_occurences(self):
        result = self._result()
        self.assertIsInstance(result, dict)
        locations = result['locations']['items']
        self.assertEqual(2, len(locations))

        rome, athens = self._location_items()
        self.assertListEqual(rome['pages'], [2, 3])
        self.assertListEqual(athens['pages'], [4])
        self.assertEqual(rome['count'], 3)
        self.assertEqual(athens['count'], 1)

        # There should be empty fields for the other keys
        for key in ['persons', 'keyterms', 'time_expressions']:
            self.assertIsInstance(result[key], dict)
            self.assertListEqual(result[key]['items'], [])

    def test_adding_references(self):
        self.assertListEqual(self._rome()['references'], [])

        inputs = [
            dict(id='2323295', url='https://gazetteer.dainst.org/place/2323295', type='gazetteer'),
            dict(id='fU6rkJhWHGsd', url='http://chronontology.dainst.org/period/fU6rkJhWHGsd', type='chronontology')
        ]

        self.builder.add_reference(Kind.location, 'Rom', **inputs[0])
        self.builder.add_reference(Kind.location, 'Rom', **inputs[1])

        rome = self._rome()
        self.assertEqual(len(rome['references']), 2)
        self.assertIn(inputs[0], rome['references'])
        self.assertIn(inputs[1], rome['references'])

    def test_setting_the_score(self):
        self.assertIsNone(self._rome()['score'])
        self.builder.set_score(Kind.location, 'Rom', 12.345)
        self.assertEqual(self._rome()['score'], 12.345, 'Should set score field')
        self.builder.set_score(Kind.location, 'Rom', 23.456)
        self.assertEqual(self._rome()['score'], 23.456, 'Should override score field')

    def test_adding_coordinates(self):
        self.assertIsNone(self._rome()['coordinates'], 'Should be None initially')
        self.builder.set_coordinates(Kind.location, 'Rom', (1.23456, 12.3456))
        self.assertListEqual(self._rome()['coordinates'], [1.23456, 12.3456], 'Should set coords as list')
        self.builder.set_coordinates(Kind.location, 'Rom', (2.34567, 23.4567))
        self.assertListEqual(self._rome()['coordinates'], [2.34567, 23.4567], 'Should override coords')
