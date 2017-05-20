'use strict';
const express = require('express');

const router = express.Router();

/*const User = require('../models/user.js');

router.route('/')
	.get(function(req,res) {
		User.list().then(models => {
			res.json(
				models.map(model => model.format())
			);
		})
		.catch(e => {
			res.status(e.status || 500);
			res.json(e.message || 'Unhandled exception, check log.');
		});
	})

	.post(function(req, res) {
		var credentials = req.body;

		if(credentials.password !== credentials.repassword) {
			res.status(400);
			res.json({"fieldErrors": {
				"repassword": "Retype password doesn't match password"
			}});

		} else if(User.get(credentials.username)) {
			res.status(400);
			res.json({"fieldErrors": {
				"username": "User already exists"
			}});

		} else 
			new User(credentials).save().then(model => {
				res.json(model.format());
			}).catch(e => {
				res.status(e.status || 500);
				res.json(e.message || 'Unhandled exception, check log.');
			});
		}
	});

router.route('/:username')	
	.get(function(req, res) {
		User.get(req.params.username).then(user => {
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
			res.sendStatus(200);
		}).catch(e => {
			res.status(e.status || 500);
			res.json(e.message || 'Unhandled exception, check log.');
		});
	});	

module.exports = router;*/

const datastore = require('../datastore.js');


function hashString(str) {
  var hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }

  return hash;
};

router.route('/')
	.get(function(req,res) {

		if(!req.session.user) {
			res.json({
				username: 'Anonymous',
				isAuthenticated: false
			});
		} else {

			//This is stupid, but so is google datastore.
			//Can't find out how to get key by key.id
			//Don't want to pass key object to client
			const query = datastore.createQuery('user')
				.filter('id', '=', req.session.user)
				.limit(1);

			datastore.runQuery(query).then((results) => {	
				const user = results[0][0];

				if(user) {
					res.json({
						username: user.username,
						isAuthenticated: true
					});
				} else {
					res.status(400);
					res.json({"message": "Datastore error: could not fetch user with id!:" + req.session.user});
				}
			});
		}
	})

	.post(function(req, res) {
		var credentials = req.body;

		var requiredFields = {};
		if(!credentials.username) {
			requiredFields.username = 'Require field';
		}
		if(!credentials.password) {
			requiredFields.password = 'Require field';
		}
		if(!credentials.repassword) {
			requiredFields.repassword = 'Require field';
		}

		if(Object.keys(requiredFields).length) {
			res.status(400);
			res.json({
				fieldErrors: requiredFields
			});
			
		} else {

			const query = datastore.createQuery('user')
				.filter('username', '=', credentials.username);

			datastore.runQuery(query).then((results) => {
				const user = results[0][0];
				
				if(user) {
					res.status(400);
	    			res.json({"fieldErrors": {
	    				"username": "User already exists"
	    			}});

				} else if(credentials.password !== credentials.repassword) {
					res.status(400);
	    			res.json({"fieldErrors": {
	    				"repassword": "Retype password doesn't match password"
	    			}});

				} else {
					var userKey = datastore.key('user');
					var lookupId = hashString(credentials.username);

					datastore.save({
						key: userKey,
						data: [{
							name: 'id',
					        value: lookupId
						},{
					        name: 'username',
					        value: credentials.username
					    }, {
					        name: 'password',
					        value: credentials.password
					    }]

					}).then(() => {
						req.session.user = lookupId;
						res.sendStatus(200);

		    		}).catch((e) => {
		    			res.status(400);
		    			res.json({"errors": ["Datastore error: could not add user!"]});
		    		});
				}
			});
		}
	});

module.exports = router;