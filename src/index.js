const http = require('http')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const bodyParser = require('body-parser')
const routes = require(path.join(__dirname, './routes'))
const app = express()

// view engine
app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'pug')

// add middlewares
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, './public')))

// add routes
app.use('/', routes)

// Define SocketIO
const server = http.createServer(app)
const io = require('socket.io').listen(server)

io.sockets.on('connection', (socket) => {
  socket.on('messageChange', (data) => {
    console.log(data)
    socket.emit('receive', data.message.split('').reverse().join(''))
  })
})

app.set('port', process.env.port || 3000)
server.listen(app.get('port'), () => {
  console.log(`Express server listening on port ${app.get('port')}`)
})
