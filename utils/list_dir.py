import os

from utils.sorting_algorithms import sort_alphanumeric


def list_dir(directory, **kwargs):
    """
    Return the contents of the directory

    If ignore_not_found kwarg is passed as True an empty list is returned if the
    directory doesn't exits.
    If sorted kwarg is passed as True the result is alphanumerically sorted.

    :param str directory: The directory to be listed
    :return list: The contents of the directory
    """
    try:
        res = os.listdir(directory)
    except FileNotFoundError:
        if kwargs.get('ignore_not_found', False):
            res = []
        else:
            raise

    if kwargs.get('sorted', False):
        res = sort_alphanumeric(res)

    if kwargs.get('filter'):
        f_list = kwargs.get('filter')
        res_list = []
        for f_val in f_list:
            # filter the files in the result list for every representation map item
            res_list += list(filter(lambda file_name: file_name.endswith('.' + f_val), res))

    return res
