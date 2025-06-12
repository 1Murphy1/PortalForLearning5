FROM node:18-alpine

WORKDIR /app

COPY ./services/comment-service ./

RUN yarn install

RUN yarn build

EXPOSE ${PORT_COMMENT}

CMD ["node", "dist/app.js"]
