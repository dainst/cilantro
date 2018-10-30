class ApiError(Exception):
    status_code = 400

    def __init__(self, error_code, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.error_code = error_code
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        dic = dict(self.payload or ())
        dic['success'] = False
        dic['error'] = {
            "code": self.error_code,
            "message": self.message
            }
        return dic
