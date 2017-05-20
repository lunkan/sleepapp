'use strict';
const Sleep = require('../models/sleep.js');
const express = require('express');

const router = express.Router();

router.route('/')
	.post(function(req, res) {
		Sleep(req.session).create(req.body).save().then(model => {
			res.json(model.format());

		}).catch(e => {
			res.status(e.status || 500);
			res.json(e.message || 'Unhandled exception, check log.');
		}
	})
	.get(function(req, res) {
		Sleep(req.session).list().then(list => {
			res.json(
				list.map(model => model.format())
			);

		}).catch(e => {
			res.status(e.status || 500);
			res.json(e.message || 'Unhandled exception, check log.');
		}
	});

router.route('/:id')	
	.get(function(req, res) {
		Sleep(req.session).get(req.params.id).then(model => {
			if(model) {
				res.json(model.format());
			} else {
				res.sendStatus(404);
			}
			
		}).catch(e => {
			res.status(e.status || 500);
			res.json(e.message || 'Unhandled exception, check log.');
		}
    })
    .put(function(req, res) {
		Sleep(req.session).update(req.params.id, req.body).then(model => {
			if(model) {
				res.json(model.format());
			} else {
				res.sendStatus(404);
			}

		}).catch(e => {
			res.status(e.status || 500);
			res.json(e.message || 'Unhandled exception, check log.');
		}
	})
	.delete(function(req, res) {
		Sleep(req.session).delete(req.params.id).then(id => {
			res.sendStatus(200);

		}).catch(e => {
			res.status(e.status || 500);
			res.json(e.message || 'Unhandled exception, check log.');
		}
	});

module.exports = router;