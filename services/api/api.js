'use strict';
const express = require('express');
//const Datastore = require('@google-cloud/datastore');

const sessionRouter = require('./controllers/session.js');//const Session = require('./controllers/session.js');
const userRouter = require('./controllers/user.js');//const User = require('./controllers/user.js');

//const Sleep = require('./controllers/sleep.js');

//Deprecated
const sleepRouter = require('./controllers/sleep-event.js');//const SleepEvent = require('./controllers/sleep-event.js');

//const datastore = Datastore();
const router = express.Router();

function Api(app) {

	// middleware to use for all requests
	router.use(function(req, res, next) {
		console.log('Something is happening.', req.session.user);
		next();
	});
	
	//User(router);//, datastore);
	//Session(router);//, datastore);
	//Sleep(router);//, datastore);

	//SleepEvent(router);//, datastore);

	router.use('/user', userRouter);
	router.use('/session', sessionRouter);
	router.use('/sleep-event', sleepRouter);
	app.use('/api', router);


}

module.exports = Api;