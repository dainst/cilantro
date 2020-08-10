
import os

import cassis


class DaiNlpFormatError(Exception):
    pass


class DaiNlpXmiBuilder:

    typesystem_path = os.path.join(os.environ["RESOURCES_DIR"], "nlp_typesystem_dai.xml")

    def __init__(self, default_annotator_id="", xmi=None):
        with open(self.typesystem_path, 'rb') as f:
            self._typesystem = cassis.load_typesystem(f)
        self.default_annotator_id = default_annotator_id

        if xmi is None:
            self._cas = cassis.Cas(self._typesystem)
        else:
            self._cas = cassis.load_cas_from_xmi(xmi, self._typesystem)

    def get_sofa(self):
        return self._cas.sofa_string

    def set_sofa(self, sofa: str):
        """
        Set the "Subject of analysis", i.e. the string that all annotations
        are part of. Multiple Sofas are currently not supported. Will throw
        if the sofa supplied is not a string or empty, or if a sofa is already
        set.
        """
        if not isinstance(sofa, str) or sofa == "":
            raise DaiNlpFormatError("Trying to set sofa to empty string or to not a sofa.")
        if self._cas.sofa_string is None:
            self._cas.sofa_string = sofa
        else:
            raise DaiNlpFormatError('Attempt to change established sofa.')

    def _determine_annotator_id(self, attr_map):
        if 'annotatorId' not in attr_map:
            return self.default_annotator_id
        else:
            return attr_map.pop('annotatorId')

    def add_annotation(self, type_name: str, start: int, end: int, **kwargs):
        """
        Add an annotation to the document in accordance to the DAI NLP type system.
        Treats all kwargs as attributes of the entity in the xmi document.
        """
        try:
            type_class = self._typesystem.get_type(type_name)
            annotation = type_class(begin=start, end=end)
        except Exception as e:
            raise DaiNlpFormatError(e)

        annotation.annotatorId = self._determine_annotator_id(kwargs)
        if not annotation.annotatorId:
            raise DaiNlpFormatError("Attribut annotatorId is not set.")

        if 'references' in kwargs:
            annotation.references = kwargs.pop('references')

        if len(kwargs) != 0:
            raise DaiNlpFormatError(f"Unknwon attributes: {kwargs.keys()}")

        self._cas.add_annotation(annotation)
        return self

    def xmi(self) -> str:
        """
        Return an XML string that is an XMI CAS representation of the text and
        annotations processed so for.
        """
        return self._cas.to_xmi(path=None, pretty_print=True)
