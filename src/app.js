const express = require('express')
const http = require('http')
const path = require('path')
const mongo = require(path.join(__dirname, './core/db/mongo'))
const routes = require(path.join(__dirname, './routes'))
const constants = require(path.join(__dirname, './constants'))

const db = mongo.db(constants.DATABASE_URL, constants.DATABASE_NAME)

const collections = {}

mongo.collections(db, ['articles', 'users'], collections)

// const cookieParser = require('cookie-parser')
// const session = require('express-session')
const logger = require('morgan')
const errorHandler = require('errorhandler')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const app = express()
app.locals.appTitle = 'Blog Express'

// Expose collections to request handlers
app.use((req, res, next) => {
  if (!collections.articles || !collections.users) return next(new Error('No collections.'))
  req.collections = collections
  return next()
})

// Express.js configurations
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Express.js middleware configuration
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride())
app.use(require('stylus').middleware(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public')))

// development only
if (app.get('env') === 'development') {
  app.use(errorHandler('dev'))
}

// Pages and routes
app.get('/', routes.index)
app.get('/login', routes.user.login)
app.post('/login', routes.user.authenticate)
app.get('/logout', routes.user.logout)
app.get('/admin', routes.article.admin)
app.get('/post', routes.article.post)
app.post('/post', routes.article.postArticle)
app.get('/articles/:slug', routes.article.show)

// REST API routes
app.get('/api/articles', routes.article.list)
app.post('/api/articles', routes.article.add)
app.put('/api/articles/:id', routes.article.edit)
app.delete('/api/articles/:id', routes.article.del)

app.all('*', (req, res) => {
  res.status(404).send()
})

// http.createServer(app).listen(app.get('port'), function(){
// console.log('Express server listening on port ' + app.get('port'));
// });

const server = http.createServer(app)
const boot = function () {
  server.listen(app.get('port'), function () {
    console.info(`Express server listening on port ${app.get('port')}`)
  })
}
const shutdown = function () {
  server.close(process.exit)
}
if (require.main === module) {
  boot()
} else {
  console.info('Running app as a module')
  exports.boot = boot
  exports.shutdown = shutdown
  exports.port = app.get('port')
}
