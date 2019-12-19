const express = require('express')
const http = require('http')
const path = require('path')
var passport = require('passport')
var Strategy = require('passport-twitter').Strategy
var trustProxy = false
if (process.env.DYNO) {
  // Apps on heroku are behind a trusted proxy
  trustProxy = true
}
const mongoose = require('mongoose')
const models = require(path.join(__dirname, './db/models'))
const routes = require(path.join(__dirname, './routes'))
const {
  DATABASE_URL,
  DATABASE_NAME,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET
} = require(path.join(__dirname, './constants'))

passport.use(new Strategy(
  {
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: 'https://3000-e63fdfbd-390c-48bf-a337-9e9f620c0a65.ws-us02.gitpod.io/auth/twitter/callback',
    proxy: trustProxy
  },
  (token, tokenSecret, profile, cb) => cb(null, profile)
))

passport.serializeUser((user, cb) => cb(null, user))

passport.deserializeUser((obj, cb) => cb(null, obj))

const dbUrl = `${DATABASE_URL}/${DATABASE_NAME}`
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })

const cookieParser = require('cookie-parser')
const session = require('express-session')
const logger = require('morgan')
const errorHandler = require('errorhandler')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
var cors = require('cors')

const app = express()
app.locals.appTitle = 'Blog Express'

// Expose models to request handlers
app.use((req, res, next) => {
  if (!models.Article || !models.User) return next(new Error('No Models.'))
  req.models = models
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
// Other midleware
app.use(cookieParser('3CCC4ACD-6ED1-4844-9217-82131BDCB239'))
app.use(session(
  {
    secret: '2C44774A-D649-4D44-9535-46E296EF984F',
    resave: true,
    saveUninitialized: true
  }
))

// Authentication middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(methodOverride())
app.use(require('stylus').middleware(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors({ origin: '*' }))

app.use((req, res, next) => {
  if (req.session && req.session.admin) {
    res.locals.admin = true
  }
  next()
})

// development only
if (app.get('env') === 'development') {
  app.use(errorHandler('dev'))
}

// Pages and routes
app.get('/', routes.index)
app.get('/login', routes.user.login)
app.post('/login', routes.user.authenticate)
app.get('/login/twitter', passport.authenticate('twitter'))
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), (req, res) => {
  /* const promise = new Promise((resolve, reject) => {
      process.nextTick(() => {
        if (profile.screen_name === 'marcopgordillo') {
          console.log(profile.screen_name)
          session.user = profile
          session.admin = true
        }
        resolve(profile)
      })
    }) */

  if (req.user.username === 'marcopgordillo') {
    req.session.user = req.user
    req.session.admin = true
  }
  res.redirect('/admin')
})
app.get('/profile', require('connect-ensure-login').ensureLoggedIn(),
  (req, res) => res.render('profile', { user: req.user }))
app.get('/logout', routes.user.logout)
app.get('/admin', require('connect-ensure-login').ensureLoggedIn(), routes.article.admin)
app.get('/post', require('connect-ensure-login').ensureLoggedIn(), routes.article.post)
app.post('/post', require('connect-ensure-login').ensureLoggedIn(), routes.article.postArticle)
app.get('/articles/:slug', routes.article.show)

// REST API routes
app.all('/api', require('connect-ensure-login').ensureLoggedIn())
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
const boot = () => {
  server.listen(app.get('port'))
  console.info(`Express server listening on port ${app.get('port')}`)
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
