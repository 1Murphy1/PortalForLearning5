FROM node:18-alpine

WORKDIR /app

COPY ./services/lesson-service ./

RUN yarn install

RUN yarn build

EXPOSE ${PORT_LESSON}

CMD ["node", "dist/app.js"]
