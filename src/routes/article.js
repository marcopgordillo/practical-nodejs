const path = require('path')
ObjectID = require('mongodb').ObjectID
const mongo = require(path.join(__dirname, '../core/db/mongo'))
/*
 * GET article page.
 */

exports.show = (req, res, next) => {
  if (!req.params.slug) return next(new Error('No article slug.'))

  mongo.getBySlug(req.collections.articles, req.params.slug, (error, article) => {
    if (error) return next(error)
    if (!article.published) return res.status(401).send()
    res.render('article', article)
  })
}

/*
 * GET articles API.
 */

exports.list = (req, res, next) => {
  mongo.list(req.collections.articles, (err, articles) => {
    if (err) return next(err)
    res.send({ articles })
  })
}

/*
 * POST article API.
 */

exports.add = (req, res, next) => {
  if (!req.body.article) return next(new Error('No article payload.'))
  const article = req.body.article
  article.published = false
  req.collections.articles.insert(article, (error, articleResponse) => {
    if (error) return next(error)
    res.send(articleResponse)
  })
}

/*
 * PUT article API.
 */

exports.edit = (req, res, next) => {
  if (!req.params.id) return next(new Error('No article ID.'))
  
  req.collections.articles.updateOne({ _id: new ObjectID(req.params.id) }, { $set: req.body.article })
    .then((count) => {
      res.send({ affectedCount: count })
    })
    .catch((err) => console.error(err))
  }

/*
 * DELETE article API.
 */

exports.del = (req, res, next) => {
  if (!req.params.id) return next(new Error('No article ID.'))
  req.collections.articles.deleteOne({ _id: new ObjectID(req.params.id) }, (error, count) => {
    if (error) return next(error)
    res.send({ affectedCount: count })
  })
}

/*
 * GET article POST page.
 */

exports.post = (req, res, next) => {
  if (!req.body.title) { res.render('post') }
}

/*
 * POST article POST page.
 */

exports.postArticle = (req, res, next) => {
  if (!req.body.title || !req.body.slug || !req.body.text) {
    return res.render('post', { error: 'Fill title, slug and text.' })
  }
  const article = {
    title: req.body.title,
    slug: req.body.slug,
    text: req.body.text,
    published: false
  }
  req.collections.articles.insert(article, (error, articleResponse) => {
    if (error) return next(error)
    res.render('post', { error: 'Article was added. Publish it on Admin page.' })
  })
}

/*
 * GET admin page.
 */

exports.admin = (req, res, next) => {
  mongo.list(req.collections.articles, (err, articles) => {
    if (err) return next(err)
    res.render('admin', { articles })
  })
}
