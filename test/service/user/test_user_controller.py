import unittest
from base64 import b64encode

from run_service import app

test_object = 'some_tiffs'
test_file = 'test.tif'


class UserControllerTest(unittest.TestCase):

    def setUp(self):
        self.client = app.test_client()

    def test_get_user_success(self):
        b64_user = b64encode(b"test_user:test_password").decode('utf-8')
        response = self.client.get(
            f'/user/test_user',
            headers={"Authorization": f"Basic {b64_user}"}
        )
        self.assertEquals(200, response.status_code)

    def test_get_user_no_auth_header(self):
        response = self.client.get(
            f'/user/test_user'
        )
        self.assertEquals(401, response.status_code)

    def test_get_user_wrong_password(self):
        b64_user = b64encode(b"test_user:test_spassword").decode('utf-8')
        response = self.client.get(
            f'/user/test_user',
            headers={"Authorization": f"Basic {b64_user}"}
        )
        self.assertEquals(401, response.status_code)

    def test_get_user_unknown_user(self):
        b64_user = b64encode(b"test_looser:test_password").decode('utf-8')
        response = self.client.get(
            f'/user/test_user',
            headers={"Authorization": f"Basic {b64_user}"}
        )
        self.assertEquals(401, response.status_code)
