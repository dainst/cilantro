FROM node:10-stretch

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get -y install firefox-esr xvfb

COPY ./frontend /salvia

RUN cd /salvia \
    && npm update -g \
    && npm install \
    && cd node_modules/webdriver-manager/bin \
    && ./webdriver-manager update

COPY docker/cilantro-frontend-test/test.sh /test.sh

ENTRYPOINT bash /test.sh