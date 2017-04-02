'use strict';
const bodyParser = require('body-parser')
const express = require('express');
const path = require('path');

const app = express();
app.enable('trust proxy');

const Datastore = require('@google-cloud/datastore');
const datastore = Datastore();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.static(path.resolve(path.join(__dirname, '/dist'))));
//app.use('/favicon.ico', express.static('images/favicon.ico'));

const PORT = process.env.PORT || 8080;

var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname+'/index.html'));
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