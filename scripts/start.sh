#!/usr/bin/env sh

if [ $NODE_ENV = 'production' ]; then
  ./node_modules/.bin/pm2-docker start ./src/app.js -i 0 --name 'node-app'
else
  echo $NODE_ENV
  ./node_modules/.bin/nodemon ./src/app.js
fi;
