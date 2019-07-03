FROM mher/flower:latest

COPY docker/cilantro-monitor/VERSION .

ENTRYPOINT flower --broker=amqp://$BROKER_USER:$BROKER_PASSWORD@$BROKER_HOST/
