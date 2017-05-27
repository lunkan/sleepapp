'use strict';
const ds = require('../datastore.js');

const NAME = 'user';
const USER_VALID_CHARS_REGEX = /^[\w]*[^\W_][\w]*$/;//Letters, numbers and underscore
const USER_VALID_MIN_LENGTH = 5;

class UserModel {

	static getName() {
		return NAME;
	}

	static getKey(username) {
		return ds.key([NAME, username]);
	}

	static get(username) {
		const key = UserModel.getKey(username);
		return ds.get(key).then((results) => {
			return results[0] ? new UserModel(results[0]) : null;
		});
	}

	static list() {
		const query = ds.createQuery(NAME);
		return ds.runQuery(query).then((results) => {
			return results[0].map(model => new UserModel(model));
		});	
	}

	static update(username, data) {
		var user = UserModel.get(username);
		if(data.password) {
			user.password = data.password;	
		}
		return user.save();
	}

	static delete(username) {
		const key = getKey(username);
		return ds.delete(key);
	}

	static clear() {
		const query = ds.createQuery(NAME);
		return ds.runQuery(query).then((results) => {
			return results[0].map(model => model[ds.KEY]);
		}).then(deleteKeys => {
			return ds.delete(deleteKeys)
		});
	}

	constructor(data) {
		this.username = data.username;
		this.password = data.password;
	}

	isValid() {
		return this.username && this.password
			&& USER_VALID_CHARS_REGEX.test(this.username)
			&& this.username.length >= USER_VALID_MIN_LENGTH;

	}

	getFieldErrors() {
		var fieldErrors = {};
		if(!this.username) {
			fieldErrors.username = "Required";
		} else if(!USER_VALID_CHARS_REGEX.test(this.username)) {
			fieldErrors.username = "May contain letters, numbers & underscore only.";
		} else if(this.username.length < USER_VALID_MIN_LENGTH) {
			fieldErrors.username = "Username must be at least 5 character long.";
		}

		if(!this.password) {
			fieldErrors.password = "Required";
		}

		return fieldErrors;
	}

	format() {
		//Don't send password to client
		return {
			username: this.username
		};
	}

	parse() {
		return {
			username: this.username,
			password: this.password
		};
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
				key: UserModel.getKey(model.username),
				data: model
			};

			return ds.upsert(entity).then(response => {
				return new UserModel(model)
			});
    	});
	}
};

module.exports = UserModel;