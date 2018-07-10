from flask_httpauth import HTTPBasicAuth

auth = HTTPBasicAuth()

users = {
    "admin": "s3cr3t"
}


@auth.get_password
def get_password(username):
    if username in users:
        return users.get(username)
    return None
