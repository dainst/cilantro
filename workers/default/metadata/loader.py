import json
import os

_json_file = 'meta.json'


def load_metadata(path):
    """Return file contents as JSON."""
    json_path = os.path.join(path, _json_file)
    with open(json_path) as data_object:
        data = json.load(data_object)
    return data


def write_metadata(path, metadata):
    """Write JSON data from path to target file."""
    json_path = os.path.join(path, _json_file)
    with open(json_path, 'w') as outfile:
        json.dump(metadata, outfile)
