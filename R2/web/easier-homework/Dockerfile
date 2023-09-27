FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 1337
CMD [ "npm", "start" ]
