'use strict';
const express = require('express');

const router = express.Router();

/*const bcrypt = require('bcrypt-nodejs');

router.route('/login')
	.post(function(req,res) {
		var credentials = req.body;

		if(!credentials.username || !credentials.password) {
				res.status(400);
    			res.json({
    				"errors": ["Username and/or password is not provided."]
    			});
		}

		User.get(credentials.username).then(user => {
			if(!user || bcrypt.compareSync(credentials.password, user.password) {
				res.status(400);
    			res.json({
    				"errors": ["Username or password is not correct."]
    			});
			} else {
				req.session.user = user.username;
				req.session.authorized = true;
				res.json(user.format());
			}
		});
	});

router.route('/logout')
	.post(function(req,res) {
		req.session.authorized = false;
		res.sendStatus(200);
	});

module.exports = router;*/
 

const datastore = require('../datastore.js');

router.route('/login')
	.post(function(req,res) {

		var credentials = req.body;
		var userKey = datastore.key('user');

		var requiredFields = {};
		if(!credentials.username) {
			requiredFields.username = 'Require field';
		}
		if(!credentials.password) {
			requiredFields.password = 'Require field';
		}

		if(Object.keys(requiredFields).length) {
			res.status(400);
			res.json({
				fieldErrors: requiredFields
			});

		} else {

			const query = datastore.createQuery('user')
					.filter('username', '=', credentials.username)
					.filter('password', '=', credentials.password)
					.limit(1);

			datastore.runQuery(query).then((results) => {
				const user = results[0][0];

				if(!user) {
					res.status(400);
	    			res.json({
	    				"errors": ["Username or login is not correct."]
	    			});

				} else {
					req.session.user = user.id;
					res.sendStatus(200);
				}
			});
		};
	});

router.route('/logout')
	.post(function(req,res) {
		req.session.destroy(function(err) {
			if(err) {
				console.log(err);
			} else {
				res.sendStatus(200);
			}
		});
	});

module.exports = router;