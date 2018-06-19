import json
import os


def load_metadata(path):
    json_path = os.path.join(path, 'data.json')
    with open(json_path) as data_object:
        data = json.load(data_object)
    return data
