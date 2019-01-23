FROM node:10-stretch

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get -y install xvfb

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list
RUN apt-get update && apt-get -y install google-chrome-stable

COPY frontend /frontend
COPY config/create_settings_from_env.sh /create_settings_from_env.sh

WORKDIR /frontend
RUN npm update -g \
    && npm install -g gulp-cli \
    && npm install

COPY docker/cilantro-frontend-test/test.sh /test.sh

ENTRYPOINT bash /test.sh
