FROM node:slim as builder

WORKDIR /app
COPY server /app/server
COPY client /app/client
COPY build.sh /app
RUN (cd server && npm i) && (cd client && npm i) && ./build.sh


FROM node:slim

ENV PORT 3000

WORKDIR /app
COPY --from=builder /app/dist /app

CMD [ "node", "index.js" ]