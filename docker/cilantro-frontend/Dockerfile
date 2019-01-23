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

RUN rm -R /usr/share/nginx/html/
COPY ./frontend /usr/share/nginx/html
WORKDIR /usr/share/nginx/html
RUN npm update -g \
    && npm install \
    && cd node_modules/webdriver-manager/bin \
    && ./webdriver-manager update

#write startup-script (which creates settings.json)
RUN touch /root/startup.sh \
    && echo "#!/bin/bash\n" >> /root/startup.sh \
    && echo "cd /usr/share/nginx/html/config\n" >> /root/startup.sh \
    && echo "./create_settings_from_env.sh" >> /root/startup.sh \
    && echo "nginx -g 'daemon off;'" >> /root/startup.sh \
    && chmod a+x /root/startup.sh \
    && chmod a+x /usr/share/nginx/html/config/create_settings_from_env.sh

# startup script
ENTRYPOINT ["/root/startup.sh"]
