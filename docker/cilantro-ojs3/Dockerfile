FROM debian:9.7-slim

LABEL maintainer="Deutsches Archäologisches Institut: dev@dainst.org"
LABEL author="Dennis Twardy: kontakt@dennistwardy.com"
LABEL version="1.0"
LABEL description="DAI specific OJS3 Docker container with DAI specific plugins"
LABEL license="GNU GPL 3"

ENV DEBIAN_FRONTEND noninteractive
ENV OJS_PORT="8000"
ENV ADMIN_EMAIL="dummy@address.local"
ENV OJS_BRANCH="stable-3_1_2"
ENV MYSQL_DB="ojs"

ARG MYSQL_USER
ARG MYSQL_PASSWORD
ARG ADMIN_USER
ARG ADMIN_PASSWORD

# ENV MYSQL_USER="ojs"
# ENV MYSQL_PASSWORD="ojs"
# ENV ADMIN_USER="admin"
# ENV ADMIN_PASSWORD="password"



### Install packes needed for installing from custom repos ###
RUN apt-get update && apt-get install -y \
    gnupg2 \
    software-properties-common \
    dirmngr \
    wget \
    apt-transport-https \
    openssh-server


### SSH Server ###
RUN mkdir /var/run/sshd
RUN echo 'root:root' |chpasswd

RUN sed -ri 's/^#?PermitRootLogin\s+.*/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN sed -ri 's/UsePAM yes/#UsePAM yes/g' /etc/ssh/sshd_config

RUN mkdir /root/.ssh

### Add MariaDB repo ###
# Workaround for unreachable keyserver in DAI network...
# The alternative would be to use the mariadb-server of the default
# packages, which is version 10.1 though
# RUN apt-key adv --no-tty --recv-keys --keyserver keyserver.ubuntu.com 0xF1656F24C74CD1D8
COPY docker/cilantro-ojs3/conf/mariadb_key /tmp/mariadb_key
RUN apt-key add /tmp/mariadb_key
RUN add-apt-repository 'deb [arch=amd64,i386,ppc64el] http://mirrors.dotsrc.org/mariadb/repo/10.3/debian stretch main'
# Add PHP repo
RUN wget -q -O- https://packages.sury.org/php/apt.gpg | apt-key add -
RUN echo "deb https://packages.sury.org/php/ stretch main" | tee /etc/apt/sources.list.d/php.list

RUN apt-get update && apt-get install -y \
    bash-completion \
    ca-certificates \
    curl \
    openssl \
    apache2 \
    mariadb-server \
    libapache2-mod-php \
    php7.3 \
    php7.3-bcmath \
    php7.3-bz2 \
    php7.3-cgi \
    php7.3-cli \
    php7.3-common \
    php7.3-curl \
    php7.3-dba \
    php7.3-intl \
    php7.3-json \
    php7.3-mbstring \
    php7.3-mysql \
    php7.3-readline \
    php7.3-xml \
    php7.3-zip \
    acl \
    build-essential \
    cron \
    expect \
    git \
    libssl-dev \
    nano \
    supervisor \
    unzip

WORKDIR /tmp

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - \
    && apt-get -y install \
    nodejs
RUN curl -sS https://getcomposer.org/installer -o composer-setup.php \
    && php composer-setup.php --install-dir=/usr/local/bin --filename=composer

### Configure Apache ###
# Adding configuration files
COPY docker/cilantro-ojs3/conf/php.ini /etc/php/7.3/apache2/
COPY docker/cilantro-ojs3/conf/php.ini /etc/php/7.3/cli/
COPY docker/cilantro-ojs3/conf/ojs-apache.conf /etc/apache2/conf-available
COPY docker/cilantro-ojs3/conf/ojs-ssl-site.conf /etc/apache2/sites-available
COPY docker/cilantro-ojs3/conf/ojs-site.conf /etc/apache2/sites-available
COPY docker/cilantro-ojs3/conf/.htpasswd /etc/apache2/

# Ports
RUN sed -i "s/^Listen 80.*\$/Listen $OJS_PORT/" /etc/apache2/ports.conf
RUN sed -i "s/^<VirtualHost \*:80>.*\$/<VirtualHost \*:$OJS_PORT>/" /etc/apache2/sites-available/ojs-site.conf

# Adding SSL keys and set access rights them
COPY docker/cilantro-ojs3/ssl/apache.crt /etc/apache2/ssl
COPY docker/cilantro-ojs3/ssl/apache.key /etc/apache2/ssl
RUN chmod 600 -R /etc/apache2/ssl

RUN a2ensite ojs-site \
    && a2dissite 000-default \
    && a2enmod rewrite
RUN echo "#!/bin/sh\nif [ -s /etc/apache2/sites-available/ojs-ssl-site.conf ]; then\na2enmod ssl\na2ensite ojs-ssl-site.conf\nfi"
RUN ln -sf /dev/stdout /var/log/apache2/access.log \
    && ln -sf /dev/stderr /var/log/apache2/error.log

# configure git
RUN git config --global url.https://.insteadOf git://
RUN git config --global advice.detachedHead false

# Add OJS installation scripts and change permissions
COPY docker/cilantro-ojs3/scripts/ojsInstall.exp /root/ojsInstall.exp
RUN chmod +x /root/ojsInstall.exp

### Initialize MySQl database ###
RUN service mysql start && \
    echo "CREATE USER '${MYSQL_USER}'@'localhost' IDENTIFIED BY '${MYSQL_PASSWORD}';" | mysql -u root && \
    echo "UPDATE mysql.user SET plugin = 'mysql_native_password' WHERE User='${MYSQL_USER}'; FLUSH PRIVILEGES;" | mysql -u root && \
    echo "CREATE DATABASE ${MYSQL_DB};" | mysql -u root && \
    echo "GRANT ALL PRIVILEGES on ${MYSQL_DB}.* TO '${MYSQL_USER}'@'localhost'; FLUSH PRIVILEGES;" | mysql -u root

### Install OJS ###
RUN mkdir -p /var/www/ojsfiles
WORKDIR /var/www/html
RUN rm index.html
RUN git init && \
    git remote add -t ${OJS_BRANCH} origin https://github.com/pkp/ojs.git && \
    git fetch origin --depth 1 ${OJS_BRANCH} && \
    git checkout --track origin/${OJS_BRANCH}
RUN git submodule update --init --recursive

# php modules
RUN composer install -v -d lib/pkp --no-dev
RUN composer install -v -d plugins/paymethod/paypal --no-dev
RUN composer install -v -d plugins/generic/citationStyleLanguage --no-dev

# js modules
RUN npm install -y
RUN npm run build

# config file
RUN cp config.TEMPLATE.inc.php config.inc.php

# initial file rights
WORKDIR /var
RUN chgrp -f -R www-data www && \
    chmod -R 771 www && \
    chmod g+s www && \
    setfacl -Rm o::x,d:o::x www && \
    setfacl -Rm g::rwx,d:g::rwx www

# run installer
WORKDIR /var/www
RUN service mysql start && \
    expect /root/ojsInstall.exp ${ADMIN_USER} ${ADMIN_PASSWORD} ${ADMIN_EMAIL} ${MYSQL_USER} ${MYSQL_PASSWORD} ${MYSQL_DB}

### Install OJS Plugins ###
WORKDIR /var/www/html/plugins
RUN git clone -b ojs3 https://github.com/dainst/ojs-cilantro-plugin.git generic/ojs-cilantro-plugin && \
    cd generic/ojs-cilantro-plugin && \
    git submodule update --init --recursive
RUN git clone -b ojs3 https://github.com/dainst/ojs-zenon-plugin.git pubIds/zenon
RUN git clone -b ojs3 https://github.com/dainst/epicur.git oaiMetadataFormats/epicur
RUN git clone -b ojs3 https://github.com/dainst/ojs-dainst-theme themes/ojs-dainst-theme && \
    cd themes/ojs-dainst-theme && \
    git submodule update --init --recursive
RUN git clone --single-branch -b ${OJS_BRANCH} https://github.com/asmecher/texture generic/texture && \
    git submodule update --init --recursive

### configurate OJS ###
WORKDIR /var/www
RUN git clone https://github.com/dainst/ojs-config-tool ojsconfig
RUN service mysql start && \
    php /var/www/ojsconfig/ojs3.php --journal.theme=ojs-dainst-theme --theme=ojs-dainst-theme --journal.plugins=themes/ojs-dainst-theme
RUN sed -i 's/allowProtocolRelative = false/allowProtocolRelative = true/' /var/www/html/lib/pkp/classes/core/PKPRequest.inc.php

# set file rights (after configuration and installation!)
WORKDIR /var/www/
RUN chgrp -f -R www-data html/plugins && \
    chmod -R 771 html/plugins && \
    chmod g+s html/plugins && \
    setfacl -Rm o::x,d:o::x html/plugins && \
    setfacl -Rm g::rwx,d:g::rwx html/plugins

RUN chgrp -f -R www-data html/cache && \
    chmod -R 771 html/cache && \
    chmod g+s html/cache && \
    setfacl -Rm o::x,d:o::x html/cache && \
    setfacl -Rm g::rwx,d:g::rwx html/cache

RUN chgrp -f -R www-data html/public && \
    chmod -R 771 html/public && \
    chmod g+s html/public && \
    setfacl -Rm o::x,d:o::x html/public && \
    setfacl -Rm g::rwx,d:g::rwx html/public

RUN chgrp -f -R www-data ojsfiles && \
    chmod -R 771 ojsfiles && \
    chmod g+s ojsfiles && \
    setfacl -Rm o::x,d:o::x ojsfiles && \
    setfacl -Rm g::rwx,d:g::rwx ojsfiles

### go ###
COPY docker/cilantro-ojs3/docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["docker-entrypoint.sh"]

EXPOSE $OJS_PORT 443 3306 33060 22
