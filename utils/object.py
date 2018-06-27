from datetime import datetime
from io import BytesIO
import json
from typing import List, Iterator, TextIO


class Actor:
    """
    Personal and legal entities in cilantro metadata.
    """

    firstname: str
    lastname: str

    def get_json(self):
        return json.dumps(self.__dict__, default=_to_serializable)


class ObjectMetadata:
    """
    Basic metadata that can be recorded for every cilantro object
    """

    id: str
    title: str
    abstract: str
    description: str
    type: str
    creator: Actor
    created: datetime

    issue_year: int
    issue_no: str
    issue_volume: str

    def get_json(self):
        return json.dumps(self.__dict__, default=_to_serializable)


def _to_serializable(val):
    if hasattr(val, '__dict__'):
        return val.__dict__
    return str(val)


class Object:
    """
    A cilantro object, i.e. a single work unit.

    A cilantro object is a folder that only contains the following files and
    subfolders:
    * a file `meta.json` that contains the metadata for this object
    * additional metadata files that describe the object in different formats
      (e.g. mets.xml, tei.xml, marc.xml, ...)
    * a folder `data` that contains representations of the complete object
      in different binary formats, one representation corresponds to a
      subfolder that can hold one or more files in the same format
    * a folder `parts` that contains any number of subfolders that follow the
      naming patterns `part_XXXX` which in turn are cilantro objects that
      conform to this definition

    This class offers a single interface to the underlying structure and
    simplifies the management of cilantro objects.
    """

    path: str
    metadata: ObjectMetadata

    def __init__(self, path):
        """
        Create an empty cilantro object.

        Creates a data folder and an empty meta.json.
        """

    @staticmethod
    def read(path):
        """
        Read an already existent cilantro object.

        This validates the `meta.json` and populates the metadata attribute with
        its contents.

        :param str path: The path to the root folder of the existing object
        :return Object:
        """

    def write(self):
        """
        Write the current object state to the file system.

        :return: None
        """

    def add_file(self, representation: str, file: BytesIO):
        """
        Add a file to a representation of the object.

        A new representation is created if it does not already exist.

        :param str representation:
        :param BytesIO file:
        :return: None
        """

    def list_representations(self) -> List[str]:
        """
        List the representations that the object offers.

        :return List[str]:
        """

    def get_representation(self, represensation: str) -> Iterator[BytesIO]:
        """
        Get all files that correspond to a given representation.

        :param str represensation:
        :return Iterator[BytesIO]:
        """

    def write_metadata_file(self, name: str, file: TextIO):
        """
        Add a metadata file to the object.

        A new file is created with the given name if it does not already exist,
        otherwise the existing file is overwritten.

        :param file:
        :param name:
        :return:
        """

    def add_child(self):
        """
        Add a sub-object to this object.

        Creates a new part_XXXX folder under parts. Also creates the parts
        folder if it does not exist already.

        :return: Object
        """

    def get_children(self):
        """
        Get all sub-objects of this object

        :return Iterator[Object]:
        """

    def copy(self, path):
        """
        Copy the whole contents of this object to a new location.

        :param str path: The new location on the file system
        :return Object: A new object instance representing the copy
        """
