'use strict';
const datastore = require('../datastore.js');
const express = require('express');

const router = express.Router();

router.route('/')
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

router.route('/:event_id')	
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

module.exports = router;