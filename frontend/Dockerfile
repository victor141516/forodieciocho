FROM node:18 as dev
WORKDIR /app
COPY package.json /app/
RUN npm install
COPY . /app
ENTRYPOINT [ "npm", "run", "dev" ]