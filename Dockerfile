FROM node:argon

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install --production
RUN npm install -g forever

# Bundle app source
COPY dist /usr/src/app

ENV NODE_ENV production
ENV PORT 8080
ENV REDIS_URL "redis://redis:$REDIS_PORT_6379_TCP_PORT"
ENV MONGO_URL "mongodb://mongo/apiver"

EXPOSE 8080
CMD [ "forever", "-f", "server/app.js" ]
