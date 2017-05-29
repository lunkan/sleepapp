'use strict';
const ds = require('../datastore.js');
const User = require('./user.js');

const NAME = 'sleep';

class SleepModelFactory {

	constructor(session) {
		this.ancestorPath = [User.getName(), session.username];
		this.rand = Math.random();
	}

	getAncestorPath() {
		//Must clone (immutable), or Google DS erase it.
		return this.ancestorPath.concat([]);
	}

	getKey(id) {
		let keyPath = this.getAncestorPath().concat([NAME]);

		//Ids are integers, but returned as values (strange Google!!!)
		if(id) {
			keyPath.push(parseInt(id)); 
		}

		return ds.key(keyPath); 
	}

	get(id) {
		const key = this.getKey(id);
		return ds.get(key).then(results => {
			return results[0];
		});
	}

	list() {
		const ancestorKey = ds.key(this.getAncestorPath());
		const query = ds.createQuery(NAME).hasAncestor(ancestorKey);

		return ds.runQuery(query).then((results) => {
			return results[0];
		});	
	}

	update(dataList) {
		const entities = dataList.map(data => {
			const key = this.getKey(data.id);
			return {
				key: key,
				data: new SleepData(key, data).parse()
			};
		});

		return ds.update(entities).then(result => 
			entities.map(entity => entity.data)
		);
	}

	create(dataList) {
		const ancestorKey = ds.key(this.getAncestorPath().concat([NAME]));

		return ds.allocateIds(ancestorKey, dataList.length).then(result => {
			const entities = result[0].map((key, i) => ({
				key: key,
				data: new SleepData(key, dataList[i]).parse()
			}));

			return ds.insert(entities).then(result => 
				entities.map(entity => entity.data)
			);
		});
	}

	clearAll() {
		const ancestorKey = ds.key(this.getAncestorPath());
		const query = ds.createQuery(NAME).hasAncestor(ancestorKey);

		return ds.runQuery(query).then((results) => {
			const deleteKeys = results[0].map(model => model[ds.KEY]);
			return ds.delete(deleteKeys);
		});
	}

	delete(id) {
		const key = this.getKey(id);
		return ds.delete(key).then(result => {
			return id;
		});
	}
}

class SleepData {

	constructor(key, data) {
		this.id = key.id.toString();
		this.preSleep = new Date(data.preSleep);
		this.sleep = new Date(data.sleep);
		this.wakeUp = new Date(data.wakeUp);
	}

	parse() {
		if(this.isValid()) {
			return {
				id: this.id,
				preSleep: this.preSleep,
				sleep: this.sleep,
				wakeUp: this.wakeUp,
			}
		} else {
			throw {
				name: 'ParseErrors',
				status: 400,
				message: {
					fieldErrors: this.getFieldErrors()
				}
			};
		}
	}

	isValid() {
		return this.id
			&& !isNaN(this.preSleep.getTime())
			&& !isNaN(this.sleep.getTime())
			&& !isNaN(this.wakeUp.getTime());
	}

	getFieldErrors() {
		var fieldErrors = {};

		if(!this.id) {
			fieldErrors.preSleep = "Id Required";
		}
		if(isNaN(this.preSleep.getTime())) {
			fieldErrors.preSleep = "Not a valid date";
		}
		if(isNaN(this.preSleep.getTime())) {
			fieldErrors.sleep = "Not a valid date";
		}
		if(isNaN(this.preSleep.getTime())) {
			fieldErrors.wakeUp = "Not a valid date";
		}

		return fieldErrors;
	}
}

module.exports = SleepModelFactory;