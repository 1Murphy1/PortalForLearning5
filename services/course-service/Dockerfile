FROM node:18-alpine

WORKDIR /app

COPY ./services/course-service ./

RUN yarn install

RUN yarn build

EXPOSE ${PORT_COURSE}

CMD ["node", "dist/app.js"]
