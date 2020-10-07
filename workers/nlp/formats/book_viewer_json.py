
from dataclasses import dataclass
import uuid
import json
from enum import Enum, auto
from urllib.parse import urlparse, urlsplit
from os.path import basename


@dataclass(eq=True, frozen=True)
class _Reference:
    id: str
    url: str
    type: str


class _Item:

    def __init__(self, id_str: str):
        self.id: str = id_str
        self.score = None
        self.terms: {str} = set()
        self.pages: {int} = set()
        self.count: int = 0
        self.lemma: str = ""
        self.coordinates: (float, float) = None
        self.references: {_Reference} = set()


class Kind(Enum):
    person = auto()
    keyterm = auto()
    location = auto()
    timex = auto()


def parse_reference_from_url(url: str):
    """
    Used to convert a URL into the reference format values that the book viewer expects.
    Examples:
        'https://gazetteer.dainst.org/place/2128554/'
            -> ('2128554', 'https://gazetteer.dainst.org/place/2128554/', 'gazetteer')
        'https://xyz.example.com/some/path?param=123'
            -> ('', 'https://xyz.example.com/some/path?param=123', 'xyz.example.com')
    """
    try:
        url = url.strip('/')
        parsed = urlparse(url)
        if len(parsed.netloc) <= 0:
            raise Exception()
    except:
        return ('', '', '')

    id = ''
    if parsed.netloc in ['gazetteer.dainst.org', 'chronontology.dainst.org']:
        name = parsed.netloc.split('.')[0] # 'gazetteer' or 'chronontology'
        if parsed.path is not None and len(parsed.path) > 0:
            id = basename(parsed.path)
    else:
        name = parsed.netloc

    return (id, url, name)


class BookViewerJsonBuilder:

    def __init__(self):
        self._kinds_to_item_dicts: {str: {str: _Item}} = dict()

    def _item_d(self, kind: Kind) -> dict:
        if kind not in self._kinds_to_item_dicts:
            self._kinds_to_item_dicts[kind] = dict()
        return self._kinds_to_item_dicts[kind]

    def _item(self, kind: Kind, lemma: str) -> _Item:
        item_d = self._item_d(kind)
        if lemma not in item_d:
            item_d[lemma] = _Item(str(uuid.uuid1()))
            item_d[lemma].lemma = lemma
        return item_d[lemma]

    def add_occurence(self, kind: Kind, lemma: str, page: int, term: str):
        item = self._item(kind, lemma)
        item.pages.add(page)
        item.terms.add(term)
        item.count += 1

    def add_reference(self, kind: Kind, lemma: str, id: str, url: str, type: str):
        reference = _Reference(id, url, type)
        self._item(kind, lemma).references.add(reference)

    def set_score(self, kind: Kind, lemma: str, score: float):
        self._item(kind, lemma).score = score

    def set_coordinates(self, kind: Kind, lemma: str, coordinates: (float, float)):
        self._item(kind, lemma).coordinates = coordinates

    def to_json(self) -> str:
        kinds_to_keys = {
            Kind.person: 'persons',
            Kind.location: 'locations',
            Kind.keyterm: 'keyterms',
            Kind.timex: 'time_expressions'
        }
        result = dict()
        for kind, key in kinds_to_keys.items():
            if kind in self._kinds_to_item_dicts.keys():
                result[key] = {'items': list(self._kinds_to_item_dicts[kind].values())}
            else:
                result[key] = {'items': []}

        def encode_fn(obj):
            if isinstance(obj, set):
                return list(obj)
            try:
                return obj.toJSON()
            except AttributeError:
                return obj.__dict__
        return json.dumps(result, default=encode_fn, indent=4)
