import os
from datetime import datetime
from io import BytesIO
import json
from pathlib import Path
from typing import List, Iterator
from distutils.dir_util import copy_tree

from utils.list_dir import list_dir


class PathDoesNotExist(Exception):
    pass


class InvalidObjectIdError(Exception):
    """
    This error is raised if the object ID is invalid.

    This may happen when an object_id is incorrectly formatted, for
    example when the last 4 characters are no digits.
    """
    pass


class Object:
    """
    A cilantro object, i.e. a single work unit.

    A cilantro object is a folder that only contains the following files and
    subfolders:
    * a file `meta.json` that contains the metadata for this object
    * additional metadata files that describe the object in different formats\
      (e.g. mets.xml, tei.xml, marc.xml, ...)
    * a folder `data` that contains representations of the complete object\
      in different binary formats, one representation corresponds to a\
      subfolder that can hold one or more files in the same format
    * a folder `parts` that contains any number of subfolders that follow the\
      naming patterns `part_XXXX` which in turn are cilantro objects that\
      conform to this definition

    This class offers a single interface to the underlying structure and
    simplifies the management of cilantro objects.
    """

    INITIAL_REPRESENTATION = "origin"
    DATA_DIR = "data"

    REPRESENTATION_MAP = {
        'tif': [ 'tif', 'tiff' ], 
        'jpg': [ 'jpg', 'jpeg' ], 
        'pdf': [ 'pdf' ],
        'txt': [ 'txt' ]
    }

    def __init__(self, path):
        """
        Create an empty cilantro object that lives in path or finds one.

        :param str path: the Path where the object lives.
        """
        self.path = path

        if not os.path.exists(self.path):
            os.makedirs(self.path)
        if os.path.exists(os.path.join(self.path, 'meta.json')):
            try:
                with open(os.path.join(self.path, 'meta.json'), 'r', encoding="utf-8") as file_handler:
                    val = json.load(file_handler)
                    self.id = val['id']
                    self.metadata = val['metadata']
            except ValueError:
                self.metadata = {}
                self.id = None
        else:
            self.metadata = {}
            self.id = None

    def write(self):
        """
        Write the current object metadata state to the file system.

        :return: None
        """
        with open(os.path.join(self.path, 'meta.json'), 'w',
                  encoding="utf-8") as out:

            val = {'id': self.id, 'metadata': self.metadata}
            json.dump(val, out)

    def add_stream(self, file_name: str, representation: str, file: BytesIO):
        """
        Add a stream to a representation of the object.

        A new representation is created if it does not already exist.

        :param str file_name: how the generated file should be named
        :param str representation: The file format of the input.
        :param BytesIO file: The input stream
        :return: None
        """
        if not os.path.exists(self.get_representation_dir(representation)):
            os.makedirs(self.get_representation_dir(representation))
        with open(os.path.join(self.get_representation_dir(representation),
                               file_name), 'wb+') as stream:
            stream.write(file.read())

    def add_file(self, representation: str, src: str):
        """
        Add a file to a representation of the object.

        This acts as a convenience wrapper around `add_stream()` and handles
        opening and reading the file.

        The generated file has the same name as the source file.

        :param str representation: The file format of the input.
        :param str src: The path to the source file
        :return: None
        """
        with open(src, 'rb') as stream:
            self.add_stream(os.path.basename(src), representation,
                            BytesIO(stream.read()))

    def list_representations(self) -> List[str]:
        """
        List the representations that the object offers.

        :return List[str]:
        """
        representations = []
        if os.path.exists(self.get_data_dir()):
            representations = os.listdir(self.get_data_dir())
            representations.sort()
        return representations

    def get_representation(self, representation: str) -> Iterator[BytesIO]:
        """
        Get all files that correspond to a given representation.

        :param str representation:
        :return Iterator[BytesIO]:
        """
        representations = []
        path = self.get_representation_dir(representation)

        if not os.path.isdir(path):
            # the given representation, must either reside under its own folder or the main data folder
            path = self.get_data_dir()

        for filename in list_dir(path, sorted=True, filter=self.REPRESENTATION_MAP[representation]):
            if not os.path.isdir(os.path.join(path, filename)):
                with open(os.path.join(path, filename), 'rb') as file:
                    representations.append(BytesIO(file.read()))
        return iter(representations)

    def copy(self, path):
        """
        Copy the whole contents of this object to a new location.

        :param str path: The new location on the file system
        :return Object: A new object instance representing the copy
        """
        copy_tree(self.path, path)

    def get_data_dir(self):
        """
        Return the path to the data directory.

        :return str:
        """
        return os.path.join(self.path, self.DATA_DIR)

    def get_representation_dir(self, representation: str):
        """
        Return the path to a representation directory.

        :param str representation: The name of the representation
        :return str:
        """
        return os.path.join(self.get_data_dir(), representation)
