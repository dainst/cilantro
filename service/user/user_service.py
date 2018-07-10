import os
import yaml
from flask_httpauth import HTTPBasicAuth

auth = HTTPBasicAuth()

_users_config = os.path.join(os.environ['CONFIG_DIR'], "users.yml")
_users_file = open(_users_config, 'r')
users = yaml.load(_users_file)


@auth.get_password
def get_password(username):
    if username in users:
        return users.get(username)['password']
    return None
