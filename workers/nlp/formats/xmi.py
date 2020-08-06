
import cassis


class DaiNlpFormatError(Exception):
    pass


class DaiNlpXmiBuilder:

    def __init__(self, typesystem_path: str, default_annotator_id=""):
        with open(typesystem_path, 'rb') as f:
            self._typesystem = cassis.load_typesystem(f)
        self._cas = cassis.Cas(self._typesystem)
        self.default_annotator_id = default_annotator_id

    def set_sofa(self, sofa: str):
        """
        Set the "Subject of analysis", i.e. the string that all annotations
        are part of. Multiple Sofas are currently not supported.
        """
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
        return self._cas.to_xmi(path=None, pretty_print=True)
