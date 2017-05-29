'use strict';
const express = require('express');
const sessionRouter = require('./controllers/session.js');
const userRouter = require('./controllers/user.js');
const sleepRouter = require('./controllers/sleep.js');

//Deprecated
const sleepEventRouter = require('./controllers/sleep-event.js');

const router = express.Router();

function Api(app) {

	// middleware to use for all requests
	router.use(function(req, res, next) {
		console.log('Something is happening.', req.session.user, req.originalUrl);
		next();
	});

	router.use('/user', userRouter);
	router.use('/session', sessionRouter);
	router.use('/sleep', sleepRouter);
	router.use('/sleep-event', sleepEventRouter);
	app.use('/api', router);
}

module.exports = Api;