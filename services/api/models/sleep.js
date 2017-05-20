'use strict';
const moment = require('moment');
const ds = require('../datastore.js');
const User = require('./User.js');

const NAME = 'sleep';

class SleepModelFactory {

	constructor(session) {
		this.keyPathRoot = [User.getName(), session.username, NAME];
	}

	getKey(id) {
		const keyPath = id ? this.keyPathRoot.concat([id]) : this.keyPathRoot;
		return ds.key(keyPath); 
	}

	get(id) {
		const key = getKey(id);
		return ds.get(key).then((results) => {
			return new SleepModel(results[0]));
		});
	}

	list() {
		const queryKey = getKey();
		const query = ds.createQuery(NAME)
			.filter('__key__', '>', queryKey);
			.order('sleep');

		return ds.runQuery(query).then((results) => {
			return results[0].map(model => new SleepModel(model));
		});	
	}

	update(id, data) {
		const key = getKey(id);
		return new SleepModel(data, key).save();
	}

	create(data) {
		const key = getKey();
		return new SleepModel(data, key).save();
	}

	delete(id) {
		const key = getKey(id);
		return ds.delete(key);
	}
}

class SleepModel {

	constructor(data) {
		//Store id to be tracked on client
		this.id = data[ds.KEY] ? data[ds.KEY].id : undefined;

		//sleep data is either isoDate string or js Date
		this.preSleep: moment(data.preSleep),
		this.sleep: moment(data.preSleep),
		this.wakeUp: moment(data.preSleep)
	}

	isValid() {
		return this.preSleep.isValid()
			&& this.sleep.isValid()
			&& this.wakeUp.isValid();
	}

	getFieldErrors() {
		var fieldErrors = {};

		if(this.preSleep.isValid()) {
			fieldErrors.preSleep = this.preSleep ? "Not a valid moment" : "Required";
		}
		if(this.sleep.isValid()) {
			fieldErrors.sleep = this.sleep ? "Not a valid moment" : "Required";
		}
		if(this.wakeUp.isValid()) {
			fieldErrors.wakeUp = this.wakeUp ? "Not a valid moment" : "Required";
		}

		return fieldErrors;
	}

	format() {
		return {
			id: this.id,
			preSleep: this.preSleep.format(),
			sleep: this.preSleep.format(),
			wakeUp: this.preSleep.format() 
		}
	}

	parse() {
		return {
			preSleep: this.preSleep.toDate(),
			sleep: this.preSleep.toDate(),
			wakeUp: this.preSleep.toDate() 
		}
	}

	save() {
		return new Promise((resolve, reject) => {
			if(!this.isValid()) {
				reject({
					status: 400,
					message: {
						fieldErrors: this.getFieldErrors()
					}
				});
			} else {
				resolve(this.parse());
			}

		}).then(model => {
			const entity = {
				key: getKey(this.id),
				data: model
			};

			return ds.upsert(entity).then(response => new SleepModel(response[0][0]));
    	});
	}
});

module.exports = SleepModel;