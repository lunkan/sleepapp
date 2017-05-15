'use strict';
const bodyParser = require('body-parser')
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
app.enable('trust proxy');
app.use(session({
	secret: 'spacebear',
	resave: true,
	saveUninitialized: false,
	cookie: {}
}));

const Datastore = require('@google-cloud/datastore');
const datastore = Datastore();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.static(path.resolve(path.join(__dirname, '/dist'))));

const PORT = process.env.PORT || 8080;

var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	console.log('Something is happening.', req.session.user);
	next();
});


app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname+'/index.html'));
});

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

function getFakeUser(session) {
	return {
		username: session.user || 'Anonymous',
		isAuthenticated: session.user ? true : false
	}
}

function listUsers() {
	console.log('list users - ok');
	const query = datastore.createQuery('user');

	datastore.runQuery(query).then((results) => {
		results[0].forEach(user => {
			console.log('USER:', user[datastore.KEY], user);
		});
	});
}

function deleteAllUsers() {
	const query = datastore.createQuery('user');

	datastore.runQuery(query).then((results) => {
		return results[0].map(user => user[datastore.KEY]);
	}).then((keys) => {
		console.log('deleteUserKeys', keys);
		datastore.delete(keys).then(() => {
			console.log('Tasks deleted successfully.');
		});
	});
}

router.route('/user')
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
		if(req.body) {
	    	var credentials = req.body;

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
		    			res.json({"message": "Datastore error: could not add user!"});
		    		});
				}
			});
	    	
		} else {
			res.status(400);
			res.json({"message": "Post data missing!"});
		}
	});

router.route('/login')
	.post(function(req,res) {

		//listUsers();
		/*req.session.destroy(function(err) {
			if(err) {
				console.log(err);
			} else {
				deleteAllUsers();
				res.sendStatus(200);
			}
		});*/
		var credentials = req.body;
		var userKey = datastore.key('user');

		const query = datastore.createQuery('user')
				.filter('username', '=', credentials.username)
				.filter('password', '=', credentials.password)
				.limit(1);

		datastore.runQuery(query).then((results) => {
			const user = results[0][0];

			if(!user) {
				res.status(400);
    			res.json({"Error": "Username or login is not correct."});

			} else {
				req.session.user = user.id;
				res.sendStatus(200);
			}
		});
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

router.route('/sleep-event')
	.post(function(req, res) {
	    if(req.body) {
	    	var sleepEvent = req.body;
			var eventKey = datastore.key('sleepEvent');
			datastore.save({
				key: eventKey,
				data: [{
			        name: 'startTime',
			        value: sleepEvent.startTime
			      }, {
			        name: 'sleepTime',
			        value: sleepEvent.sleepTime,
			        excludeFromIndexes: true
			      }, {
			        name: 'endTime',
			        value: sleepEvent.endTime
			      }]
			}).then(() => {
				res.json({"id": eventKey.id});
    		}).catch((e) => {
    			res.status(400);
    			res.json({"message": "Datastore error!"});
    		});
	    	
		} else {
			res.status(400);
			res.json({"message": "Post data missing!"});
		}
	})
	.get(function(req, res) {
		const query = datastore.createQuery('sleepEvent').order('startTime');
		datastore.runQuery(query).then((results) => {
			const tasks = results[0];
			tasks.forEach((task) => {
				task.id = task[datastore.KEY].id;
			});

			res.json({ data: tasks });
		});
	});

router.route('/sleep-event/:event_id')	
	.get(function(req, res) {
		var selectedEvent = sleepEvents.find(event => event.id == req.params.event_id);
        res.json(selectedEvent);
    })
    .put(function(req, res) {
    	const transaction = datastore.transaction();
    	const key = datastore.key(['sleepEvent', parseInt(req.params.event_id)]);

    	transaction.run()
    		.then(() => transaction.get(key))
    		.then((results) => {
    			const task = results[0];
    			Object.assign(task, req.body);
    			transaction.save({
    				key: key,
    				data: task
    			});

    			return transaction.commit();
    		})
    		.then(() => {
				res.sendStatus(200);
    		})
    		.catch((e) => {
    			transaction.rollback()
    			res.status(400);
				res.json({"error": e});
    		});
	})
	.delete(function(req, res) {
		const key = datastore.key(['sleepEvent', parseInt(req.params.event_id)]);
		datastore.delete(key).then(() => {
			res.sendStatus(200);
		}).catch((e) => {
			res.status(400);
			res.json({"error": e});
		});
	});

app.use('/api', router);

app.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname+'/index.html'));
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = router