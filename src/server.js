const path = require('path')
const express = require('express')
const derby = require('derby')
const racerBrowserChannel = require('racer-browserchannel')
const liveDbMongo = require('livedb-mongo')

const app = require(path.join(__dirname, 'app'))
const expressApp = module.exports = express()
const redis = require('redis').createClient()

const mongoUrl = 'mongodb://localhost:27017/editor'

const store = derby.createStore(
  {
    db: liveDbMongo(mongoUrl + '?auto_reconnect', { safe: true }),
    redis: redis
  }
)

const publicDir = paht.join(__dirname, 'public')

expressApp
  .use(express.favicon())
  .use(express.compress())
  .use(app.scripts(store))
  .use(racerBrowserChannel(store))
  .use(store.modelMiddleware())
  .use(app.router())
  .use(expressApp.router)

expressApp.all('*', (req, res, next) => next('404: ' + req.url))
