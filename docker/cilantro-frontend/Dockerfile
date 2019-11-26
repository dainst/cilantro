FROM node:12.6.0-alpine as builder

RUN apk update && apk upgrade && \
    apk add --no-cache git

COPY . /src
WORKDIR /src/frontend

ARG VUE_APP_BACKEND_URI

RUN echo "VUE_APP_BACKEND_URI = $VUE_APP_BACKEND_URI" > .env

RUN npm install && npm run build


FROM nginx:1.17-alpine

RUN mkdir /app
COPY --from=0 /src/frontend/dist /app
COPY docker/cilantro-frontend/nginx.conf /etc/nginx/nginx.conf
