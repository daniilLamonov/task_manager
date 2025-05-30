FROM node:22 AS BUILD

WORKDIR /app

COPY package*.json /app/

RUN npm i

COPY ./ /app/

RUN npm run build

FROM nginx:1

COPY --from=BUILD /app/dist/ /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

