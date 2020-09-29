
from dataclasses import dataclass
import uuid
import json

@dataclass(eq=True, frozen=True)
class _Reference:
    id: str
    url: str
    type: str

class _Item:

    def __init__(self, id: str):
        self.id: str = id
        self.score = None
        self.terms: {str} = set()
        self.pages: {int} = set()
        self.count: int = 0
        self.lemma: str = ""
        self.coordinates: (float, float) = None
        self.references: {_Reference} = set()

class BookViewerJsonBuilder():

    def __init__(self):
        self._kinds_to_item_dicts: { str: { str: _Item } } = {}

    def _item_d(self, kind: str) -> dict:
        if kind not in self._kinds_to_item_dicts:
            self._kinds_to_item_dicts[kind] = dict()
        return self._kinds_to_item_dicts[kind]

    def _item(self, kind, lemma) -> _Item:
        item_d = self._item_d(kind)
        if lemma not in item_d:
            item_d[lemma] = _Item(id=str(uuid.uuid1()))
            item_d[lemma].lemma = lemma
        return item_d[lemma]

    def add_occurence(self, kind: str, lemma: str, page: int, term: str):
        item = self._item(kind, lemma)
        item.pages.add(page)
        item.terms.add(term)
        item.count += 1

    def add_reference(self, kind: str, lemma: str, id: str, url: str, type: str):
        reference = _Reference(id, url, type)
        self._item(kind, lemma).references.add(reference)

    def set_score(self, kind, lemma, score: float):
        self._item(kind, lemma).score = score

    def set_coordinates(self, kind, lemma, coordinates: (float, float)):
        self._item(kind, lemma).coordinates = coordinates

    def to_json(self) -> str:
        kinds_to_keys = {
            'person': 'persons',
            'location': 'locations',
            'keyterm': 'keyterms',
            'time_expression': 'time_expressions'
        }
        result = dict()
        for kind, key in kinds_to_keys.items():
            if kind in self._kinds_to_item_dicts.keys():
                result[key] = { 'items': list(self._kinds_to_item_dicts[kind].values()) }
            else:
                result[key] = { 'items': [] }

        def encode_fn(obj):
            if (isinstance(obj, set)):
                return list(obj)
            else:
                try:
                    return obj.toJSON()
                except AttributeError:
                    return obj.__dict__
        return json.dumps(result, default=encode_fn, indent=4)
