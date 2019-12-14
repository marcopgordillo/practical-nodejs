const fs = require('fs')
fs.writeFile('message.txt', 
  'Hello World!', (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  } else {
    console.log('Writing is done.')
  }
})
