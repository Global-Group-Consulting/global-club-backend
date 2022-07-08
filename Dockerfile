FROM node:14.18.0-alpine

RUN apk add --no-cache python3 g++ make
RUN apk add --no-cache python3 g++ make
RUN yarn set version 1.22.15

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

CMD ["yarn", "start:debug"]

EXPOSE 3000
