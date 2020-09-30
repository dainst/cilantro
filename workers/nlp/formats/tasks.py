
from workers.base_task import FileTask

from workers.nlp.formats.xmi import Annotation, DaiNlpXmiReader
from workers.nlp.formats.book_viewer_json import Kind, BookViewerJsonBuilder, parse_reference_from_url

from typing import Iterator, Tuple


class DaiBookViewerFormatTask(FileTask):

    name = "nlp.formats.dai_book_viewer_json"
    label = "Dai Book Viewer JSON"
    description = "Convert from DAI XMI annotations to JSON, that the DAI Book Viewer can display."

    @staticmethod
    def _annotation_to_kind(a: Annotation):
        if a == Annotation.timex or a == Annotation.temponym:
            return Kind.timex
        if a == Annotation.place:
            return Kind.location
        if a == Annotation.person:
            return Kind.person
        return Kind.keyterm

    @classmethod
    def _to_occurence(cls, annotation):
        kind = cls._annotation_to_kind(Annotation(annotation.type))
        text = annotation.get_covered_text()
        if kind == Annotation.timex:
            lemma = annotation.timexValue
        else:
            lemma = text
        return (kind, lemma, text)

    @staticmethod
    def _to_references(annotation) -> Iterator[Tuple[str, str, str]]:
        if annotation.references is not None and len(annotation.references) > 0:
            for url in annotation.references:
                id, url, type = parse_reference_from_url(url)
                yield (id, url, type)

    @classmethod
    def _convert(cls, reader: DaiNlpXmiReader, builder: BookViewerJsonBuilder):
        # How many pages are in the xmi?
        for page in reader.annotations(Annotation.page):
            page_no = int(page.number)
            # Which named entities are on a single page?
            for covered in reader.covered_annotations(covering=page, kind_covered=Annotation.named_entity):
                kind, lemma, term = cls._to_occurence(covered)
                builder.add_occurence(kind=kind, lemma=lemma, page=page_no, term=term)
                for (id, url, type) in cls._to_references(covered):
                    builder.add_reference(kind, lemma, id=id, url=url, type=type)

    def process_file(self, file, target_dir):
        builder = BookViewerJsonBuilder()
        with open(file, mode='rb') as f:
            reader = DaiNlpXmiReader(f)

        self._convert(reader=reader, builder=builder)

        with open(self.default_target_name(file, target_dir, 'json'), mode='w', encoding='utf8') as out_file:
            out_file.write(builder.to_json())
