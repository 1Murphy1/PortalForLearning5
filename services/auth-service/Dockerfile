FROM node:18-alpine

WORKDIR /app

COPY ./services/auth-service ./

RUN yarn install

RUN yarn build

EXPOSE ${PORT_AUTH}

CMD ["node", "dist/app.js"]
