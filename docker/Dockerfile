FROM nginx:1.14

#ENV BACKEND_URI https://localhost:5000
#ENV ZENON_URI   https://zenon.dainst.org/api/v1
#ENV OJS_URI     http://localhost:4444/ojs/plugins/generic/ojs-cilantro-plugin/api

# dependencies
RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get -y install git apt-transport-https nano gnupg wget
# we need a newer node version to get npm
RUN wget https://deb.nodesource.com/gpgkey/nodesource.gpg.key \
    && sh -c 'apt-key add nodesource.gpg.key > /dev/null 2>&1' \
    && sh -c 'echo "deb https://deb.nodesource.com/node_8.x stretch main" >> /etc/apt/sources.list.d/nodesource.list' \
    && apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get -y install nodejs

# salvia
RUN git clone https://github.com/dainst/salvia.git /usr/share/nginx/html/salvia \
    && cd /usr/share/nginx/html/salvia \
    && npm update -g \
    && npm install

#write settings.json
RUN cd /usr/share/nginx/html/salvia/config \
    && mv settings.docker.json settings.json \
    && sed -i -e "s@##BACKEND_URI##@${BACKEND_URI}@g" settings.json \
    && sed -i -e "s@##ZENON_URI##@${ZENON_URI}@g" settings.json \
    && sed -i -e "s@##OJS_URI##@${OJS_URI}@g" settings.json

# startup script
ENTRYPOINT ["nginx", "-g", "daemon off;"]

# goto http://localhost:7979/salvia/index.html