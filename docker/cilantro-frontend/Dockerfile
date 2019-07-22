FROM node:12.6.0-alpine as builder

COPY frontend .
RUN npm install
RUN npm run build


FROM nginx:1.17-alpine

RUN rm -R /usr/share/nginx/html/

COPY --from=builder /dist /usr/share/nginx/html
COPY docker/cilantro-frontend/VERSION .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
