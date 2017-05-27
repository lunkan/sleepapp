'use strict';
const express = require('express');
const sessionRouter = require('./controllers/session.js');
const userRouter = require('./controllers/user.js');

//Deprecated
const sleepRouter = require('./controllers/sleep-event.js');

const router = express.Router();

function Api(app) {

	// middleware to use for all requests
	router.use(function(req, res, next) {
		console.log('Something is happening.', req.session.user, req.originalUrl);
		next();
	});

	router.use('/user', userRouter);
	router.use('/session', sessionRouter);
	router.use('/sleep-event', sleepRouter);
	app.use('/api', router);
}

module.exports = Api;