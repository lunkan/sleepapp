'use strict';
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user.js');
const Session = require('../models/session.js');

const router = express.Router();

router.route('/')
	.get(function(req,res) {
		User.list().then(models => {
			res.json(models.map(model => model.format()));
		})
		.catch(e => {
			res.status(e.status || 500);
			res.json(e.message || 'Unhandled exception, check log.');
		});
	})

	.post(function(req, res) {
		var credentials = req.body;
		var newUser = new User({
			password: credentials.password ? bcrypt.hashSync(credentials.password) : undefined,
			username: credentials.username
		});

		if(!newUser.isValid()) {
			res.status(400);
			res.json({"fieldErrors":
				newUser.getFieldErrors()
			});

		} else if(credentials.password !== credentials.repassword) {
			res.status(400);
			res.json({"fieldErrors": {
				"repassword": "Retype password doesn't match password"
			}});

		} else {
			User.get(credentials.username).then(user => {
				if(user) {
					res.status(400);
					res.json({"fieldErrors": {
						"username": "User already exists"
					}});

				} else {
					newUser.save().then(model => {
						req.session.username = model.username;
						req.session.isAuthenticated = true;
						res.json(new Session(req.session).format());
					}).catch(e => {
						res.status(e.status || 500);
						res.json(e.message || 'Unhandled exception, check log.');
					});
				}
			});
		}
	});

router.route('/clear').get(function(req,res) {
	User.clear().then(ids => {
		res.json(ids);
	});
});

router.route('/:username')	
	.get(function(req, res) {
		User.get(req.params.username).then(user => {
			if(user) {
				res.json(user.format());
			} else {
				res.sendStatus(404);
			}
		}).catch(e => {
			res.status(e.status || 500);
			res.json(e.message || 'Unhandled exception, check log.');
		});
    })

    .put(function(req, res) {
    	User.update(req.params.username, req.body).then(user => {
			if(user) {
				res.json(user.format);
			} else {
				res.sendStatus(404);
			}
		}).catch(e => {
			res.status(e.status || 500);
			res.json(e.message || 'Unhandled exception, check log.');
		});
	})

	.delete(function(req, res) {
		User.delete(req.params.username).then(username => {
			new Sleep(username).clearAll().then(() => {
				res.sendStatus(200);
			});
		}).catch(e => {
			res.status(e.status || 500);
			res.json(e.message || 'Unhandled exception, check log.');
		});
	});	

module.exports = router;