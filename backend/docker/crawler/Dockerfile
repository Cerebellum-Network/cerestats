FROM node:16

WORKDIR /usr/app/crawler

COPY ./package.json /usr/app
COPY ./yarn.lock /usr/app
COPY ./backend /usr/app/crawler
COPY ./db /usr/app/db

RUN yarn 

CMD ["yarn", "start"]
