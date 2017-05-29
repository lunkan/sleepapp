'use strict';

class SessionModel {

	constructor(data) {
		this.username = data.username || 'guest';
		this.isAuthenticated = data.isAuthenticated === true;
	}

	format() {
		return {
			username: this.username,
			isAuthenticated: this.isAuthenticated
		};
	}
};

module.exports = SessionModel;