FROM php:5.6.36-apache-jessie
# never versions of php or debian will not work with ojs2

LABEL maintainer="Deutsches Archäologisches Institut: dev@dainst.de"
EXPOSE 80
USER root

ENV admin_user=admin
ENV admin_password="password"
ENV admin_email="email@adress.xx"
ENV mysql_password="ojs"
ENV mysql_db="ojs"
ENV enable_plugins="generic/ojs-dainst-frontpage-generator-plugin,pubIds/urnDNB,pubIds/zenon"

RUN printf "deb http://archive.debian.org/debian/ jessie main\ndeb-src http://archive.debian.org/debian/ jessie main\ndeb http://security.debian.org jessie/updates main\ndeb-src http://security.debian.org jessie/updates main" > /etc/apt/sources.list

# php settings
RUN echo "error_reporting=E_ALL & ~E_WARNING & ~E_NOTICE & ~E_STRICT & ~E_DEPRECATED"  >> /usr/local/etc/php/php.ini
RUN echo "date.timezone = Europe/Berlin"  >> /usr/local/etc/php/php.ini

# mysql
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get -y install git mysql-server nano
RUN docker-php-ext-install -j$(nproc) mysql \
  && echo "mysql.default_socket=/run/mysqld/mysqld.sock"  >> /usr/local/etc/php/php.ini
# see https://github.com/docker/for-linux/issues/72
RUN find /var/lib/mysql -type f -exec touch {} \; \
  && service mysql start \
  && sh -c "echo \"CREATE DATABASE ${mysql_db};\" | mysql" \
  && mysqladmin -u root password ${mysql_password}

# OJS2
RUN git clone -b ojs-stable-2_4_8 https://github.com/pkp/ojs.git /var/www/html/ojs
RUN sed -i -e 's/git:/https:/g' /var/www/html/ojs/.gitmodules \
  && cd /var/www/html/ojs \
  && git submodule init \
  && git submodule update
RUN sed -i -e 's/git:/https:/g' /var/www/html/ojs/lib/pkp/.gitmodules \
  && cd /var/www/html/ojs/lib/pkp/ \
  && git submodule init \
  && git submodule update
WORKDIR /var/www/html/ojs/lib/pkp/ \
RUN sh -c 'curl -sS https://getcomposer.org/installer | php'
RUN chmod -R 777 /var/www/html/ojs/cache \
  && chmod -R 777 /var/www/html/ojs/public \
  && mkdir /OJSfiles \
  && chmod -R 777 /OJSfiles
RUN cp /var/www/html/ojs/config.TEMPLATE.inc.php /var/www/html/ojs/config.inc.php

# run installation
RUN find /var/lib/mysql -type f -exec touch {} \; \
  && service mysql start \
  && echo "en_US\nde_DE\nutf-8\n\n\n/OJSfiles\nmd5\n${admin_user}\n${admin_password}\n${admin_password}\n${admin_email}\nmysql\nlocalhost\nroot\n${mysql_password}\n${mysql_db}\nN\ndockerizedOjs\nY\nY" > /tmp/dialog \
  && sh -c  'cat /tmp/dialog | php /var/www/html/ojs/tools/install.php install'

# frontmatter plugin dependencies
RUN mkdir /var/www/tmp \
  && chmod -R 777 /var/www/tmp \
  && echo "[dainst]\ntmpPath = /var/www/tmp" >> /var/www/html/ojs/config.inc.php
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get -y install ImageMagick Exiftool pdftk

# dainst - plugins
RUN git clone https://github.com/dainst/ojs-dainst-theme.git /var/www/html/ojs/plugins/themes/dainst \
  && cd /var/www/html/ojs/plugins/themes/dainst \
  && git submodule init \
  && git submodule update
RUN git clone https://github.com/dainst/ojs-dainst-frontpage-generator-plugin.git /var/www/html/ojs/plugins/generic/ojs-dainst-frontpage-generator-plugin \
  && cd /var/www/html/ojs/plugins/generic/ojs-dainst-frontpage-generator-plugin \
  && git submodule init \
  && git submodule update
RUN git clone https://github.com/dainst/ojs-cilantro-plugin.git /var/www/html/ojs/plugins/generic/ojs-cilantro-plugin \
  && cd /var/www/html/ojs/plugins/generic/ojs-cilantro-plugin \
  && git submodule init \
  && git submodule update
RUN git clone https://github.com/dainst/ojs-dainst-zenonlink-plugin.git /var/www/html/ojs/plugins/pubIds/zenon
RUN git clone https://github.com/dainst/ojs-plugin-urnDNB -b ojs2 /var/www/html/ojs/plugins/pubIds/urnDNB

# set up test journal and activate plugins
RUN git clone https://github.com/dainst/ojs-config-tool.git /root/ojs-config-tool
RUN find /var/lib/mysql -type f -exec touch {} \; \
  && service mysql start \
  && php /root/ojs-config-tool/ojs2.php --theme=dainst --journal.theme=dainst --journal.plugins=${enable_plugins}

# activate CORS
RUN a2enmod headers
RUN echo 'Header set Access-Control-Allow-Origin "*"' > /var/www/html/ojs/.htaccess

# some final configs
RUN a2enmod rewrite
RUN chmod -R 777 /OJSfiles
RUN chmod -R 777 /var/www/html/ojs/plugins/generic/ojs-dainst-frontpage-generator-plugin/lib/tcpdf/fonts/

# Ignore protocol when constructing base url
# see https://forum.pkp.sfu.ca/t/ojs-3-behind-reverse-proxy-how-to-achieve/25055/16
RUN sed -i "s/\$_this->_baseUrl = \$_this->getProtocol() . ':\/\/'/\$_this->_baseUrl = '\/\/'/" /var/www/html/ojs/lib/pkp/classes/core/PKPRequest.inc.php

# startup script
RUN echo "#!/bin/bash\nfind /var/lib/mysql -type f -exec touch {} \;\nservice mysql start\napachectl -DFOREGROUND" >> /root/startup.sh  \
  && chmod a+x /root/startup.sh

COPY docker/cilantro-ojs2/VERSION .

ENTRYPOINT ["/root/startup.sh"]
