require('dotenv').config()

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost:27017',
  DATABASE_NAME: process.env.DATABASE_NAME || 'blog',
  TWITTER_CONSUMER_KEY: process.env.TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET: process.env.TWITTER_CONSUMER_SECRET

}