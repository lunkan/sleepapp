'use strict';
const express = require('express');
const bcrypt = require('bcrypt-nodejs');

const Session = require('../models/session.js');
const User = require('../models/user.js');

const router = express.Router();

router.route('/')
	.get(function(req, res) {
		res.json(new Session(req.session).format());
	})

	.post(function(req,res) {
		var credentials = req.body;

		if(!credentials.username || !credentials.password) {
				res.status(400);
    			res.json({
    				"errors": ["Username and/or password is not provided."]
    			});
		}

		User.get(credentials.username).then(user => {
			if(!user || !bcrypt.compareSync(credentials.password, user.password)) {
				res.status(400);
    			res.json({
    				"errors": ["Username or password is not correct."]
    			});
			} else {
				req.session.user = user.username;
				req.session.isAuthenticated = true;
				res.json(new Session(req.session).format());
			}
		});
	})

	.delete(function(req, res) {
		req.session.isAuthenticated = false;
		res.json(new Session(req.session).format());
	});

module.exports = router;