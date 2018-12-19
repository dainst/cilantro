import os
import hashlib

from utils.list_dir import list_dir
from utils.sorting_algorithms import sort_alphanumeric

repository_dir = os.environ['REPOSITORY_DIR']


def list_objects_in_repository():
    """
    List all object_ids in the repository

    This method assumes the objects to be stored in checksum-based folders.
    E.g. the object with the id "foo" is stored under "ac/bd/foo".

    :return list: List of all object_ids in the repository
    """
    object_ids = []
    for f1 in list_dir(repository_dir):
        for f2 in list_dir(os.path.join(repository_dir, f1)):
            for object_id in list_dir(os.path.join(repository_dir, f1, f2)):
                object_ids.append(object_id)
    return sort_alphanumeric(object_ids)


def generate_repository_path(object_id):
    """
    Generates the path of a cilantro (sub)object in the repository.

    This is based on the md5 checksum of the object_id.

    E.g. object_id "foo" is stored under "ac/bd/foo" and the object_id
    "foo/part_0001" (subobject of "foo") is stored under
    "ac/bd/foo/parts/part_0001".

    :param str object_id: The bject_id of the cilantro object, may contain
        slashes if it is a subobject. Works with any depth.
    :return str: The path where the object is stored in the repository
    """
    objects = object_id.split("/")
    md5 = _generate_md5(objects[0])
    path = os.path.join(md5[0:2], md5[2:4], objects[0])
    for seg in objects[1:]:
        path = os.path.join(path, 'parts', seg)
    return path


def _generate_md5(string):
    """
    Generates the hexadecimal md5 checksum of a string

    :param str string: The string to use
    :return str: The hexadecimal md5 checksum of the string
    """
    m = hashlib.md5()
    m.update(str.encode(string))
    return m.hexdigest()
