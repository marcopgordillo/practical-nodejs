const fs = require('fs')
const path = require('path')
fs.createReadStream(path.join(__dirname, './data/customers.csv')).pipe(process.stdout)
