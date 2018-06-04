import logging.config
import os
import yaml


def setup_logging():
    logging_conf = os.path.join(os.environ['CONFIG_DIR'], "logging.yml")
    if os.path.exists(logging_conf):
        with open(logging_conf, 'rt') as f:
            config = yaml.safe_load(f.read())
        logging.config.dictConfig(config)
    else:
        logging.basicConfig(level='INFO')
        logging.warning(f"Logging configuration at {logging_conf} "
                        f"does not exist!")
