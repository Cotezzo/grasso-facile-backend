FROM node:16.5.0
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8443
CMD [ "node", "src/index.js"]