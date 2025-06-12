FROM node:18-alpine

WORKDIR /app

COPY ./services/favorite-service ./

RUN yarn install

RUN yarn build

EXPOSE ${PORT_FAVORITE}

CMD ["node", "dist/app.js"]
