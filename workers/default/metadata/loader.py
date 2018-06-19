import json
import os


_json_file = 'data.json'


def load_metadata(path):
    json_path = os.path.join(path, _json_file)
    with open(json_path) as data_object:
        data = json.load(data_object)
    return data


def write_metadata(path, metadata):
    json_path = os.path.join(path, _json_file)
    with open(json_path, 'w') as outfile:
        json.dump(metadata, outfile)
