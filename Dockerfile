FROM node:lts-alpine

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

# Bundle app source
COPY . .

RUN addgroup -S analytics && adduser -S -s /bin/false analytics -G analytics

EXPOSE 4000
CMD [ "yarn", "run", "production" ]