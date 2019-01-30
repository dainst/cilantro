import inspect
import json
from collections import namedtuple


class PathDoesNotExist(Exception):
    pass


class SerializableClass(object):

    @classmethod
    def from_dict(cls, dic: dict):
        """
        Create an object of the given Class from a dictionary.

        Fills the attributes accordingly.

        :param dict dic: The dictionary that represents the object of the class
        :return: cls: The generated object
        """
        for key, value in dic.items():
            if isinstance(value, dict):
                dic[key] = cls._create_subobject(key, value)

        obj = object.__new__(cls)
        obj.__dict__ = dic
        return obj

    @classmethod
    def _create_subobject(cls, key, value):
        key_class = inspect.getmembers(cls)[0][1][key]
        if SerializableClass().__class__ in inspect.getmro(key_class):
            return key_class.from_dict(value)
        else:
            return value

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
        """
        Return the attributes as dict.
        :return dict: The attributes as dict
        """
        d = {}
        for key, value in self.__dict__.items():
            if SerializableClass().__class__ in inspect.getmro(value.__class__):
                d[key] = value.to_dict()
            else:
                d[key] = value

        return d

    def get_attribute(self, attribute):
        """
        Return the value of one attribute
        :param attribute: the attribute for which the value should be returned
        :return: the value of the attribute, can be any type
        """
        d = self.to_dict()
        try:
            return d[attribute]
        except KeyError:
            return None


def _to_serializable(val):
    if hasattr(val, '__dict__'):
        return val.__dict__
    return str(val)
