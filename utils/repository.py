import os

from utils.list_dir import list_dir
from utils.sorting_algorithms import sort_alphanumeric
from utils.object import InvalidObjectIdError

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
    Generate the path of a cilantro (sub)object in the repository.

    This is based on the last 4/2 digits of the object_id, which should
    be a zenon or atom ID.

    E.g. object_id "JOURNAL-ZID1234567" is stored under
    "4500/4567/JOURNAL-ZID1234567".

    :param str object_id: The object_id of the cilantro object.
    :return str: The path where the object is stored in the repository
    """
    if len(object_id) < 4:
        raise InvalidObjectIdError(f"object_id '{object_id}' "
                                   f"has to have at least 4 characters")
    folder = object_id[-4:]
    if not folder.isdigit():
        raise InvalidObjectIdError(f"The last 4 characters of object_id "
                                   f"'{object_id}' have to be numeric")
    path = os.path.join(folder[0:2] + "00", folder, object_id)
    return path
