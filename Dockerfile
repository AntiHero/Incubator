FROM node:18 as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY --chown=node package.json yarn.lock ./
RUN yarn install

COPY --chown=node . .
RUN yarn install --production && yarn run build 

FROM node:18

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder /home/node/package*.json /home/node/
COPY --from=builder /home/node/node_modules/ /home/node/node_modules/
COPY --from=builder /home/node/dist/ /home/node/dist/

EXPOSE 9000

CMD ["node", "dist/main.js"]