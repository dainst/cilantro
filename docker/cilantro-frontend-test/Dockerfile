FROM node:10-stretch

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get -y install firefox-esr xvfb

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list
RUN apt-get update && apt-get -y install google-chrome-stable

COPY ./frontend /salvia

WORKDIR /salvia \
RUN npm update -g \
    && npm install \
    && cd node_modules/webdriver-manager/bin \
    && ./webdriver-manager update

COPY docker/cilantro-frontend-test/test.sh /test.sh

ENTRYPOINT bash /test.sh