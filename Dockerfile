
FROM node:boron

RUN mkdir keystore
WORKDIR keystore

COPY package.json /keystore

RUN npm install

COPY . /keystore

EXPOSE 3000


CMD [ "npm", "start" ]