FROM node:18.0

WORKDIR /usr/src/app

COPY . .

RUN yarn install

RUN yarn build

CMD yarn start:prod
