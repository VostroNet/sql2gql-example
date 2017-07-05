FROM node:7-alpine

ENV NODE_ENV production

ENV DEBUG * 

RUN apk add --update build-base

RUN mkdir -p /app/build/

WORKDIR /app/

COPY package.json /app/

RUN cd /app/ && npm install --production

RUN apk del build-base

COPY /build /app/build/

COPY /config.prod.js /app/config.js

CMD node --max_old_space_size=16384 ./build/server/index.js