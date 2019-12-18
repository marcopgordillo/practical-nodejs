REPORTER = list
MOCHA_OPTS = --ui bdd -c

db:
	echo Seeding blog-test *****************************************************
	./src/seed.sh
test:
	clear

	echo Starting test *********************************************************
	./node_modules/mocha/bin/mocha \
	--reporter $(REPORTER) \
	$(MOCHA_OPTS) \
	src/tests/*.js
	echo Ending test
start:
	TWITTER_CONSUMER_KEY=ABCABC \
  TWITTER_CONSUMER_SECRET=XYZXYZXYZ \
	NODE_ENV=development \
  node app.js

.PHONY: test db start
