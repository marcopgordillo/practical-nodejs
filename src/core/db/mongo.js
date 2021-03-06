'use strict'

const MongoClient = require('mongodb').MongoClient

exports.db = async (url, db) => {
  let client
  try {
    client = await MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
    return client.db(db)
  } catch (err) {
    console.error(err)
  }
}

exports.collections = async (db, collections, result) => {
  try {
    for (const collection of collections) {
      result[collection] = await db
        .then(db => db.collection(collection))
        .catch(err => { throw err })
    }
  } catch (err) {
    console.error(err)
  }
}

exports.close = (client) => {
  if (client) {
    client.close()
  }
}

exports.list = (collection, cb, query = {}) => {
  collection
    .find(query, { sort: { _id: -1 } })
    .toArray(cb)
}

exports.getBySlug = (collection, slug, cb) => {
  collection
    .findOne({ slug }, cb)
}
