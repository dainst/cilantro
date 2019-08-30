FROM node:12.6.0-alpine as builder

RUN apk update && apk upgrade && \
    apk add --no-cache git

COPY . /src
WORKDIR /src/frontend
RUN npm install
RUN npm run build


FROM nginx:1.17-alpine

RUN rm -R /usr/share/nginx/html/

COPY --from=builder /src/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
