FROM node:12.6.0-alpine as builder

RUN apk update && apk upgrade && \
    apk add --no-cache git

COPY ./.git /src/.git
COPY ./frontend/package.json /src/frontend/package.json
COPY ./frontend/package-lock.json /src/frontend/package-lock.json
WORKDIR /src/frontend

RUN npm install

COPY ./frontend /src/frontend

RUN npm run build

FROM nginx:1.17-alpine

RUN mkdir /app
COPY --from=0 /src/frontend/dist /app
COPY docker/cilantro-frontend/nginx.conf /etc/nginx/nginx.conf
COPY docker/cilantro-frontend/VERSION .
