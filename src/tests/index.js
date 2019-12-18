const boot = require('../app').boot
const shutdown = require('../app').shutdown
const port = require('../app').port
const superagent = require('superagent')
const expect = require('expect.js')

const mocha = require('mocha')
const describe = mocha.describe
const it = mocha.it
const after = mocha.after
const before = mocha.before

const path = require('path')

// TODO: seed from the test and then clean up
const seedArticles = require(path.join(__dirname, '../db/articles.json'))
// const seedUsers = require('../db/users.json')

describe('server', () => {
  before(() => {
    boot()
  })

  describe('homepage', () => {
    it('should respond to GET', (done) => {
      superagent
        .get(`http://localhost:${port}`)
        .end((error, res) => {
          expect(error).to.be(null)
          expect(res.status).to.equal(200)
          done()
        })
    })
    it('should contain posts', (done) => {
      superagent
        .get(`http://localhost:${port}`)
        .end((error, res) => {
          expect(error).to.be(null)
          expect(res.text).to.be.ok()
          seedArticles.forEach((item, index, list) => {
            if (item.published) {
              expect(res.text).to.contain(`<h2><a href="/articles/${item.slug}">${item.title}`)
            } else {
              expect(res.text).not.to.contain(`<h2><a href="/articles/${item.slug}">${item.title}`)
            }
            // console.log(item.title, res.text)
          })
          done()
        })
    })
  })

  describe('article page', () => {
    it('should display text or 401', (done) => {
      const n = seedArticles.length
      seedArticles.forEach((item, index, list) => {
        superagent
          .get(`http://localhost:${port}/articles/${seedArticles[index].slug}`)
          .end((error, res) => {
            if (item.published) {
              expect(error).to.be(null)
              expect(res.text).to.contain(seedArticles[index].text)
            } else {
              expect(error).to.be.ok()
              expect(res.status).to.be(401)
            }
            // console.log(item.title)
            if (index + 1 === n) {
              done()
            }
          })
      })
    })
  })

  after(() => {
    shutdown()
  })
})
