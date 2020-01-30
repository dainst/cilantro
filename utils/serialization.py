import inspect
import json
from collections import namedtuple


class PathDoesNotExist(Exception):
    pass


class SerializableClass(object):
    def to_named_tuple(self):
        """
        Creates a tuple<cls> object.

        Works exactly as an object from the Class cls, but is NOT an instance
        of it and has less incompatibility issues than a simple dict.

        :return: tuple<cls>: The generated named tuple
        """
        dic = self.to_dict()
        return namedtuple(self.__class__.__name__, dic.keys())(*dic.values())

    def to_json(self):
        return json.dumps(self.to_dict(), default=_to_serializable)

    def to_dict(self):
        d = {}
        for key, value in self.__dict__.items():
            if SerializableClass().__class__ in inspect.getmro(value.__class__):
                d[key] = value.to_dict()
            else:
                d[key] = value

        return d


def _to_serializable(val):
    if hasattr(val, '__dict__'):
        return val.__dict__
    return str(val)
