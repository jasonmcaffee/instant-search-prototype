FROM node:wheezy
MAINTAINER Titan

#https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

# Define app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Define static assets directory for mounted volume
#RUN mkdir -p /etc/babelfish

# Copy over package.json to tmp dir and install into tmp dir
# This speeds up the build as we don't need to download all modules from the internet every time
# http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
ADD package.json /tmp
RUN cd /tmp && npm install
# Copy tmp/node_modules into app dir
RUN cp -a /tmp/node_modules /usr/src/app

# App bundle
ADD . /usr/src/app

#have babel run the build
RUN npm run build

#for security reasons, do not allow docker to ever run with bypass for user authentication
ENV BYPASS_USER_AUTH="false"

# And go
CMD [ "npm", "start" ]
