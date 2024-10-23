FROM node:20-alpine3.19

WORKDIR /home/node/app

COPY package.json .

RUN npm ci --production

COPY ./ .

EXPOSE 3000

CMD [ "npm", "start" ]