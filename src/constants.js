module.exports = {
  DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost:27017',
  DATABASE_NAME: process.env.DATABASE_NAME || 'blog'
}