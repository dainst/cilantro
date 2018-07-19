import os


def get_all_file_paths_from_dir(dir_path: str):
    """
    Returns a list of the paths of all files in a given directory and it's sub-directories.

    :param str dir_path: The directory to get the paths from
    :return: list of the file paths.
    """
    file_list = []
    for entry in os.scandir(dir_path):
        if entry.is_file():
            file_list.append(os.path.join(dir_path, entry.name))
        else:
            file_list.extend(get_all_file_paths_from_dir(entry))
    return file_list


def list_dir(dir_path: str):
    """
    Creates and returns a dictionnary tree that represents the directory file structure.

    :param str dir_path: the path to the directory that needs to be serialized
    :return: The dictionnary structure of the directory
    """
    tree = []
    for entry in os.scandir(dir_path):
        if entry.is_file():
            tree.append({
                "type": "file",
                "name": entry.name
            })
        else:
            tree.append({
                "type": "directory",
                "name": entry.name,
                "contents": list_dir(os.path.join(dir_path, entry.name))
            })
    return tree
