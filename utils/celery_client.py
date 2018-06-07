import os

from celery import Celery
from kombu import Exchange, Queue

broker_host = os.environ['BROKER_HOST']
broker_user = os.environ['BROKER_USER']
broker_password = os.environ['BROKER_PASSWORD']
db_host = os.environ['DB_HOST']

broker_config = 'amqp://' + broker_user + ':' + broker_password + '@' + broker_host + '/'
result_config = 'redis://' + db_host

celery_app = Celery('cilantro', broker=broker_config, backend=result_config)


# http://docs.celeryproject.org/en/latest/userguide/routing.html#id2
default_exchange = Exchange('default', type='direct')
nlp_exchange = Exchange('nlp', type='direct')

celery_app.conf.task_queues = (
    Queue('default', default_exchange, routing_key='default'),
    Queue('nlp', nlp_exchange, routing_key='nlp'),
)
celery_app.conf.task_default_queue = 'default'
celery_app.conf.task_default_exchange = 'default'
celery_app.conf.task_default_routing_key = 'default'
# ----------

celery_app.conf.task_routes = {
    'annotate': {
        'queue': 'nlp',
        'routing_key': 'nlp',
    },
}

