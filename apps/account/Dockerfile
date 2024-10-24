FROM node:20-alpine3.19

WORKDIR /home/node/app

COPY package*.json ./

RUN npm ci --omit=dev

COPY ./ .

EXPOSE 3000

CMD [ "npm", "start" ]