import os
import unittest
from unittest.mock import patch

import cassis

from test.unit.worker.nlp.text_analyzer_mock import TextAnalyzer as MockAnalyzer, MockDAIEntity
from workers.nlp.annotate.nlp_components_wrapper import annotate_text, annotate_xmi
from workers.nlp.annotate.page_annotation import annotate_pages

_example_xmi_with_pages = """<?xml version='1.0' encoding='ASCII'?>
<xmi:XMI xmlns:xmi="http://www.omg.org/XMI" xmlns:cas="http:///uima/cas.ecore" xmlns:LayoutElement="http:///org/dainst/nlp/LayoutElement.ecore" xmi:version="2.0">
  <cas:NULL xmi:id="0"/>
  <LayoutElement:Page xmi:id="2" begin="0" end="25" sofa="1"/>
  <LayoutElement:Page xmi:id="3" begin="26" end="60" sofa="1"/>
  <cas:Sofa xmi:id="1" sofaNum="1" sofaID="_InitialView" mimeType="None" sofaString="Perikles war ein Grieche. Genauso wie Aristoteles aus Paris."/>
  <cas:View sofa="1" members="2 3"/>
</xmi:XMI>
"""


class AssertsXmiCanBeLoadedWithDaiTypesystem:

    @staticmethod
    def _load_dai_typesystem() -> cassis.TypeSystem:
        path = os.path.join(os.environ["RESOURCES_DIR"], "nlp_typesystem_dai.xml")
        with open(path, 'rb') as f:
            return cassis.load_typesystem(f)

    @classmethod
    def assert_xmi_can_be_loaded_with_dai_typesystem(cls, xmi) -> cassis.Cas:
        typesystem = cls._load_dai_typesystem()
        try:
            return cassis.load_cas_from_xmi(xmi, typesystem)
        except Exception as e:
            raise AssertionError(e, "Loading the annotated xmi with our typesystem failed.")


class PageAnnotationTest(unittest.TestCase, AssertsXmiCanBeLoadedWithDaiTypesystem):

    def test_annotate_pages(self):
        pages = ['A\nB\nC\n', 'Äöß', 'バートアスキー\n', 'Letzte Seite']
        result = annotate_pages(pages)

        cas = self.assert_xmi_can_be_loaded_with_dai_typesystem(result)
        self.assertEqual(cas.sofa_string, 'A\nB\nC\nÄößバートアスキー\nLetzte Seite')

        annotations = list(cas.select('org.dainst.nlp.LayoutElement.Page'))
        texts = [a.get_covered_text() for a in annotations]
        self.assertEqual(set(pages), set(texts))


@patch('workers.nlp.annotate.nlp_components_wrapper._init_text_analyzer')
class NlpComponentsAnnotationTest(unittest.TestCase, AssertsXmiCanBeLoadedWithDaiTypesystem):

    @staticmethod
    def assert_xmi_contains_annotation_for(cas: cassis.Cas, entity: MockDAIEntity):
        found = False
        for annotation in cas.select_all():
            if entity.span_start == annotation.begin \
                    and entity.span_end == annotation.end \
                    and annotation.get_covered_text() == entity.string:
                found = True
                break
        if not found:
            raise AssertionError("Unable to find annotation for entity: " + entity.string)

    def _annotate_example_text(self, mock_init) -> cassis.Cas:
        mock_init.return_value = MockAnalyzer()
        text = "Perikles war ein Grieche. Genauso wie Aristoteles aus Paris."
        xmi_str = annotate_text(text)
        return self.assert_xmi_can_be_loaded_with_dai_typesystem(xmi_str)

    def test_annotating_plain_text(self, mock_init):
        cas = self._annotate_example_text(mock_init)
        for entity in MockAnalyzer.mocked_entities:
            with self.subTest():
                self.assert_xmi_contains_annotation_for(cas, entity)

    def test_annotating_empty_text_raises_exception(self, mock_init):
        mock_init.return_value = MockAnalyzer()
        with self.assertRaises(Exception):
            annotate_text("")

    def test_annotations_have_annotator_id_with_version(self, mock_init):
        cas = self._annotate_example_text(mock_init)
        entities = list(cas.select_all())
        self.assertGreaterEqual(len(list(entities)), 1,
                                "Should find at least one annnotation to check annotator ids on.")
        for entity in entities:
            name, version = entity.annotatorId.split(":")
            self.assertEqual(name, "nlp_components")
            self.assertIsNotNone(version)

    def test_some_annotations_have_references(self, mock_init):
        cas = self._annotate_example_text(mock_init)
        found = False
        for entity in list(cas.select_all()):
            if entity.references and len(entity.references) > 0:
                found = True
                break
        self.assertTrue(found, "Should have found at least one entity with references set.")

    def test_annotating_previously_tagged_xmi(self, mock_init):
        mock_init.return_value = MockAnalyzer()

        # Mock named entities for the pages in the example xmi
        annotations = [
            MockDAIEntity(text="Perikles war ein Grieche.", start=0, end=25),
            MockDAIEntity(text="Genauso wie Aristoteles aus Paris.", start=26, end=60)
        ]

        # Annotating the example xmi should give us the entities from
        # the previous xmi plus the ones added
        result = annotate_xmi(_example_xmi_with_pages)
        cas = self.assert_xmi_can_be_loaded_with_dai_typesystem(result)
        for entity in [*annotations, *MockAnalyzer.mocked_entities]:
            with self.subTest():
                self.assert_xmi_contains_annotation_for(cas, entity)
