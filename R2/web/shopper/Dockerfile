FROM node:18 AS builder

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
RUN npm ci

COPY --chown=node:node . .
RUN npm run build

FROM node:18

USER node
WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --chown=node:node --from=builder /usr/src/app/dist dist

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
