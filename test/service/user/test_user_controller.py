import unittest

from run_service import app
from test.service.user.user_utils import get_auth_header, test_user

test_object = 'some_tiffs'
test_file = 'test.tif'


class UserControllerTest(unittest.TestCase):

    def setUp(self):
        self.client = app.test_client()

    def test_get_user_success(self):
        response = self.client.get(
            f'/user/test_user',
            headers=get_auth_header()
        )
        self.assertEqual(200, response.status_code)

    def test_get_user_no_auth_header(self):
        response = self.client.get(
            f'/user/test_user'
        )
        self.assertEqual(401, response.status_code)

    def test_get_user_wrong_password(self):
        response = self.client.get(
            f'/user/test_user',
            headers=get_auth_header(test_user, "test_spassword")
        )
        self.assertEqual(401, response.status_code)

    def test_get_user_unknown_user(self):
        response = self.client.get(
            f'/user/test_user',
            headers=get_auth_header("test_looser")
        )
        self.assertEqual(401, response.status_code)
