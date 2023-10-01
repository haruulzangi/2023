FROM ghcr.io/puppeteer/puppeteer:21.3.4

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 1337
CMD [ "npm", "start" ]
