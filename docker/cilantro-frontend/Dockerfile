FROM node:12.6.0-alpine as builder

RUN apk update && apk upgrade && \
    apk add --no-cache git

COPY ./.git /src/.git
COPY ./frontend/package.json /src/frontend/package.json
COPY ./frontend/package-lock.json /src/frontend/package-lock.json
WORKDIR /src/frontend

RUN npm install

COPY ./frontend /src/frontend

ARG VUE_APP_BACKEND_URI
ARG VUE_APP_ALLOWED_FILE_EXTENSIONS
ARG VUE_APP_ATOM_API_URL
ARG VUE_APP_ATOM_API_KEY

RUN echo "VUE_APP_BACKEND_URI = $VUE_APP_BACKEND_URI\n" \
         "VUE_APP_ALLOWED_FILE_EXTENSIONS = $VUE_APP_ALLOWED_FILE_EXTENSIONS\n" \
         "VUE_APP_ATOM_API_URL = $VUE_APP_ATOM_API_URL\n" \
         "VUE_APP_ATOM_API_KEY = $VUE_APP_ATOM_API_KEY\n" > .env

RUN npm run build

FROM nginx:1.17-alpine

RUN mkdir /app
COPY --from=0 /src/frontend/dist /app
COPY docker/cilantro-frontend/nginx.conf /etc/nginx/nginx.conf
COPY docker/cilantro-frontend/VERSION .
