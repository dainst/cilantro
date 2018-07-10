import os
import yaml
import bcrypt
from flask_httpauth import HTTPBasicAuth

auth = HTTPBasicAuth()

_users_config = os.path.join(os.environ['CONFIG_DIR'], "users.yml")
_users_file = open(_users_config, 'r', encoding="utf-8")
users = yaml.load(_users_file)


@auth.verify_password
def verify_password(username, password):
    if username in users:
        hashed_password = users.get(username)['password'].encode('utf-8')
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password)
    return False

