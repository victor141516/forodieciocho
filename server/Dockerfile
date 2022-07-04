FROM node:18 as builder
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm i
COPY . /app
RUN npm run build

FROM builder as dev
CMD [ "npm", "run", "dev" ]

FROM node:18
WORKDIR /app
COPY --from=builder /app/dist /app/package.json /app/package-lock.json /app/
RUN npm install --only=production
ENTRYPOINT ["node", "index.js"]