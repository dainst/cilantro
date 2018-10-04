import unittest

from utils.sorting_algorithms import sort_alphanumeric


class SortingAlgorithmsTest(unittest.TestCase):
    def test_sort_aplhanumeric(self):
        dir_list = ['test_1.txt', 'test.txt', 'test_11.txt', 'test_2.txt']
        res_list = sort_alphanumeric(dir_list)
        sup_res_list = ['test.txt', 'test_1.txt', 'test_2.txt', 'test_11.txt']
        self.assertEqual(res_list, sup_res_list)
