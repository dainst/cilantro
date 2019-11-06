FROM node:12.6.0-alpine as builder

RUN apk update && apk upgrade && \
    apk add --no-cache git

COPY . /src
WORKDIR /src/frontend

ARG VUE_APP_BACKEND_URI
ARG VUE_APP_ATOM_API_URL
ARG VUE_APP_ATOM_USER
ARG VUE_APP_ATOM_PASSWORD

RUN echo "VUE_APP_BACKEND_URI = $VUE_APP_BACKEND_URI\n" \
         "VUE_APP_ALLOWED_FILE_EXTENSIONS = $VUE_APP_ALLOWED_FILE_EXTENSIONS\n" \
         "VUE_APP_ATOM_API_URL = $VUE_APP_ATOM_API_URL\n" \
         "VUE_APP_ATOM_USER = $VUE_APP_ATOM_USER\n" \
         "VUE_APP_ATOM_PASSWORD = $VUE_APP_ATOM_PASSWORD\n" > .env

RUN npm install && npm run build


FROM nginx:1.17-alpine

RUN mkdir /app
COPY --from=0 /src/frontend/dist /app
COPY docker/cilantro-frontend/nginx.conf /etc/nginx/nginx.conf
