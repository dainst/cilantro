FROM nginx:1.14

# dependencies
RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get -y install git apt-transport-https nano gnupg wget
# we need a newer node version to get npm
RUN wget https://deb.nodesource.com/gpgkey/nodesource.gpg.key \
    && sh -c 'apt-key add nodesource.gpg.key > /dev/null 2>&1' \
    && sh -c 'echo "deb https://deb.nodesource.com/node_8.x stretch main" >> /etc/apt/sources.list.d/nodesource.list' \
    && apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get -y install nodejs

RUN node --version

# salvia
RUN git clone https://github.com/dainst/salvia.git /usr/share/nginx/html/salvia \
    && cd /usr/share/nginx/html/salvia \
    && cp config/settings.test.json config/settings.json
RUN npm update -g \
    && npm install

# startup script
ENTRYPOINT ["nginx", "-g", "daemon off;"]

# goto http://localhost:7979/salvia/index.html