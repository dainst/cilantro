from base64 import b64encode

test_user = "test_user"
test_password = "test_password"


def get_auth_header(user=test_user, password=test_password):
    b64_user = b64encode(f"{user}:{password}".encode('ascii')).decode('utf-8')
    return {"Authorization": f"Basic {b64_user}"}
