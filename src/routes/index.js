exports.article = require('./article')
exports.user = require('./user')
const path = require('path')
const mongo = require(path.join(__dirname, '../core/db/mongo'))

/*
 * GET home page.
 */

exports.index = (req, res, next) => 
  mongo.list(req.collections.articles, (err, articles) => {
    if (err) return next(error)
    res.render('index', { articles })
  }, { published: true })
