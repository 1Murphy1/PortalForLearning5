FROM node:18-alpine

WORKDIR /app

COPY ./services/user-service ./

RUN yarn install

RUN yarn build

EXPOSE ${PORT_USER}

CMD ["node", "dist/app.js"]
