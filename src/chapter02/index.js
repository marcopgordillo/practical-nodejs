const express = require('express')
let app = express()
const port = 3000
app.all('*', (req, res) => {
  res.send('Welcome to Practical Nodei.js!')
})
app.listen(port,
  () => {console.log(`Open at localhost:${port}`)}
)
