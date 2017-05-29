'use strict';
const Sleep = require('../models/sleep.js');
const express = require('express');

const router = express.Router();

router.route('/')
	.post(function(req, res) {
		//Can post one or many
		const dataList = Array.isArray(req.body) ? req.body : [req.body];

		new Sleep(req.session).create(dataList).then(response => {
			res.json(response);
		}).catch(e => {
			res.status(e.status || 500);
			res.json(e.message || 'Unhandled exception, check log.');
		});
	})
	.get(function(req, res) {
		new Sleep(req.session).list().then(list => {
			res.json(list);

		}).catch(e => {
			res.status(e.status || 500);
			res.json(e.message || 'Unhandled exception, check log.');
		});
	});

router.route('/clear').get(function(req,res) {
	new Sleep(req.session).clearAll().then(response => {
		res.sendStatus(200);
	});
});

router.route('/:id')	
	.get(function(req, res) {
		new Sleep(req.session).get(req.params.id).then(model => {
			if(model) {
				res.json(model);
			} else {
				res.sendStatus(404);
			}
			
		}).catch(e => {
			res.status(e.status || 500);
			res.json(e.message || 'Unhandled exception, check log.');
		});
    })
    .put(function(req, res) {
		new Sleep(req.session).update([req.body]).then(models => {
			if(models[0]) {
				res.json(models[0]);
			} else {
				res.sendStatus(404);
			}

		}).catch(e => {
			res.status(e.status || 500);
			res.json(e.message || 'Unhandled exception, check log.');
		});
	})
	.delete(function(req, res) {
		new Sleep(req.session).delete(req.params.id).then(id => {
			res.json({
				"id": id
			});

		}).catch(e => {
			res.status(e.status || 500);
			res.json(e.message || 'Unhandled exception, check log.');
		});
	});

module.exports = router;