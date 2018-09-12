FROM node:10-alpine

RUN apk add --no-cache \
    chromium \
    chromium-chromedriver \
    xvfb \
    socat \
    mesa-gl \
    mesa-egl \
    mesa-gles \
    ttf-freefont \
    udev \
    dbus \
    && dbus-uuidgen > /var/lib/dbus/machine-id \
    && adduser -G users -g "Chrome User Account" -s /bin/sh -D chrome

# Bug Chrome 64
RUN mkdir /usr/lib/chromium/swiftshader/ \
    && cp /usr/lib/libGLESv2.so.2 /usr/lib/chromium/swiftshader/libGLESv2.so \
    && cp /usr/lib/libEGL.so.1 /usr/lib/chromium/swiftshader/libEGL.so

ENV DISPLAY=:99 CHROME_BIN=/usr/bin/chromium-browser LIGHTHOUSE_CHROMIUM_PATH=/usr/bin/chromium-browser


COPY ./frontend /salvia

RUN mkdir /test

RUN touch /test/integration.sh \
    && echo "#!/bin/bash" >> /test/integration.sh \
    && echo "cd /salvia" >> /test/integration.sh \
    && echo "npm run e2e-test" >> /test/integration.sh \
    && chmod a+x /test/integration.sh

