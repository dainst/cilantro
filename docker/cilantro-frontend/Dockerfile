#FROM node:12.6.0-alpine
#
#WORKDIR /usr/src/app
#COPY frontend/dist ./
#RUN npm install -g http-server
#EXPOSE 8080
#
#CMD [ "http-server", "."]
#

FROM nginx:1.17-alpine

RUN rm -R /usr/share/nginx/html/
COPY frontend/dist /usr/share/nginx/html
COPY docker/cilantro-frontend/VERSION .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
