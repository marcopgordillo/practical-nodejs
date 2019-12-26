const os = require('os')
const exec = require('child_process').exec
const async = require('async')
const started_at = new Date()

module.exports = (req, res, next) => {
  const server = req.app
  if(req.query.info) {
    let connections = {}
    let swap
    async.parallel([
      (done) => {
        exec('netstat -an | grep :80 | wc -l', (e, res) => {
          connections['80'] = parseInt(res,10)
          done()
        })
      },
      (done) => {
        exec(
          'netstat -an | grep :'
            + server.set('port')
            + ' | wc -l',
          (e, res) => {
            connections[server.set('port')] = parseInt(res,10)
            done()
          }
        )
      },
      (done) => {
        exec('vmstat -SM -s | grep "used swap" | sed -E "s/[^0-9]*([0-9]{1,8}).*/\1/"', (e, res) => {
          swap = res
          done()
        })
      }], (e) => {
        res.send({
          status: 'up',
          version: server.get('version'),
          sha: server.set('git sha'),
          started_at: started_at,
          node: {
            version: process.version,
            memoryUsage: Math.round(process.memoryUsage().rss / 1024 / 1024)+"M",
            uptime: process.uptime()
          },
          system: {
            loadavg: os.loadavg(),
            freeMemory: Math.round(os.freemem()/1024/1024)+"M"
          },
            env: process.env.NODE_ENV,
            hostname: os.hostname(),
            connections: connections,
            swap: swap
          })
      })
    }
    else {
      res.send({status: 'up'})
    }
 }
