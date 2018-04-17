import unittest
import os

from flask import json

os.environ['BROKER_HOST'] = "localhost"
os.environ['BROKER_USER'] = "user"
os.environ['BROKER_PASSWORD'] = "password"
os.environ['DB_HOST'] = "localhost"
os.environ['CONFIG_DIR'] = "config"
from run_service import app


class JobTypeTestTest(unittest.TestCase):

    def setUp(self):
        app.testing = True
        self.client = app.test_client()

    def test_empty_db(self):
        response = self.client.post('/test/foo')
        data = json.loads(response.get_data(as_text=True))
        self.assertEquals('Accepted', data['status'])
