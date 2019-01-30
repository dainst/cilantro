import re


def sort_alphanumeric(it):
    """
    Sorts the given iterable in the way that is expected.

    E.g. test.txt, test_1.txt, test_2.txt, test_11.txt

    :param iterable it: Iterable to be sorted
    :return iterable: Sorted iterable
    """
    def _convert(text):
        if text.isdigit():
            return int(text)
        else:
            return text

    return sorted(it, key=lambda key: [_convert(c) for c in re.split('([0-9]+)',
                                                                     key)])
