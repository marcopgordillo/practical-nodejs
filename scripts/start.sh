#!/usr/bin/env sh

if [ $NODE_ENV -eq 'production' ]; then
  ./node_modules/bin/pm2-docker start ./src/app.js -i 0 --name 'node-app'
else
  nodemon ./src/app.js
fi;
