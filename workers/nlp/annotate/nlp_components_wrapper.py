
from typing import Union, IO

from workers.nlp.formats.xmi import DaiNlpXmiBuilder as XmiBuilder


def annotate_xmi(xmi: Union[IO, str]) -> str:
    """
    Annotate the text given by the "subject of analysis" in the
    provided by the xmi str.

    Assumes that the xmi conforms to the DAI NLP type system.

    Adds annotations to the annotations already present in the xmi and
    does not modify them.

    :param str xmi_str: The xmi to add annotations to.
    :return str: generated annotations as xmi
    """
    builder = XmiBuilder("", xmi=xmi)
    analyzer = _init_text_analyzer(builder.get_sofa())
    builder.default_annotator_id = _annotator_id(analyzer)
    return _do_annoatate(builder=builder, analyzer=analyzer)


def annotate_text(text: str) -> str:
    """
    Annotate the given text.

    Uses the TextAnalyzer of the dainst/nlp_components in the
    nlp-worker docker container to annotate the text.

    :param str text: the given text to annotate
    :return str: generated annotations as xmi
    """
    analyzer = _init_text_analyzer(text)
    builder = XmiBuilder(_annotator_id(analyzer))
    builder.set_sofa(text)
    return _do_annoatate(builder=builder, analyzer=analyzer)


def _do_annoatate(builder: XmiBuilder, analyzer) -> str:
    nes = analyzer.do_ner()
    types_to_entities = {
        "org.dainst.nlp.NamedEntity.Person": analyzer.get_persons(nes),
        "org.dainst.nlp.NamedEntity.Place": analyzer.geoparse(analyzer.get_locations(nes))
    }
    for type_name, entities in types_to_entities.items():
        for entity in entities:
            args = dict(type_name=type_name, start=entity.span_start, end=entity.span_end)
            if entity.references:
                args['references'] = entity.references
            builder.add_annotation(**args)
    return builder.xmi()


def _annotator_id(analyzer):
    return f"nlp_components:{analyzer.get_version()}"


def _init_text_analyzer(text):
    """
    Initialize the Text Analyzer of the nlp components.

    :param str text: The text to analyze
    :return class: The text_analyzer
    """
    # We need to include this dependency dynamically so that
    # this module can be tested without the test container needing
    # the full nlp_components dependency.
    from nlp_components.publications import TextAnalyzer
    return TextAnalyzer(text)
