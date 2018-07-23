import inspect
import json
from collections import namedtuple


class PathDoesNotExist(Exception):
    pass


class SerializableClass(object):

    @classmethod
    def from_dict(cls, json_dict):
        """
        Creates an object of the given Class from a dictionary and fills the attributes accordingly.
        :param json_dict: The dictionary that represents the object from the class.
        :return: cls: The generated object
        """
        for key, value in json_dict.items():
            if isinstance(value, dict):
                key_class = inspect.getmembers(cls)[0][1][key]
                if SerializableClass().__class__ in inspect.getmro(key_class):
                    json_dict[key] = key_class.from_dict(json_dict[key])

        obj = object.__new__(cls)
        obj.__dict__ = json_dict
        return obj

    @classmethod
    def namedtuple_from_dict(cls, json_dict):
        """
        Creates a tuple<cls> object from a dictionary and fills the attributes accordingly.
            Works exactly as an object from the Class cls, but is NOT an instance of it.
            Has less incompatibility issues as from_dict()
        :param json_dict: The dictionary that represents the object from the class.
        :return: tuple<cls>: The generated object
        """
        for key, value in json_dict.items():
            if isinstance(value, dict):
                key_class = inspect.getmembers(cls)[0][1][key]
                if SerializableClass().__class__ in inspect.getmro(key_class):
                    json_dict[key] = key_class.from_dict(json_dict[key])
        obj = namedtuple(cls.__name__, json_dict.keys())(*json_dict.values())
        return obj

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
