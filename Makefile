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
ifeq ($(NODE_ENV), production)
	$(info production) \
	./node_modules/.bin/pm2-docker start ./src/app.js -i 0 --name 'node-app'
else
	$(info development) \
	./node_modules/.bin/nodemon ./src/app.js
endif

.PHONY: test db start
