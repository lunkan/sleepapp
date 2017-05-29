import Moment from 'moment'

import SleepEvent from '../helpers/SleepEvent.js';

export const SET_API_MESSAGE = 'SET_API_MESSAGE';
export const CLEAR_API_MESSAGE = 'CLEAR_API_MESSAGE';
export const RECEIVE_SESSION = 'RECEIVE_SESSION';
export const SET_CONFIG = 'SET_CONFIG';
export const RECEIVE_SLEEP_EVENT = 'RECEIVE_SLEEP_EVENT';
export const INSERT_SLEEP_EVENT = 'INSERT_SLEEP_EVENT';
export const UPDATE_SLEEP_EVENT = 'UPDATE_SLEEP_EVENT';
export const DELETE_SLEEP_EVENT = 'DELETE_SLEEP_EVENT';
export const SAVE_SLEEP_FORM = 'SAVE_SLEEP_FORM';

function setApiMessage(id, messages) {
	return {
		type: SET_API_MESSAGE,
		id: id,
		data: messages
	}
}

export function clearApiMessage(id) {
	return {
		type: CLEAR_API_MESSAGE,
		id: id
	}
}

function receiveSession(session) {
	return {
		type: RECEIVE_SESSION,
		data: session
	}
}

function setSession(session) {
	return function (dispatch) {
		dispatch(receiveSession(session));

		if(session.isAuthenticated) {
			dispatch(fetchSleepEvents());
		}
	}
}

export function fetchSession() {
	return function (dispatch) {

		return fetch('/api/session', {
				credentials: 'include'
			})
			.then(response => response.json())
			.then(session => dispatch(setSession(session)));
	}
}

export function createUser(username, password, repassword) {
	return function (dispatch) {

		var credentials = {
	      "username": username,
	      "password": password,
	      "repassword": repassword
	  	};

		return fetch('/api/user', {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: "POST",
			credentials: 'include',
			body: JSON.stringify(credentials)
		})
		.then(response => {
			switch(response.status) {
				case 200:
					return response.json().then(
						session => dispatch(setSession(session))
					);

				default:
					return response.json().then(
						errors => dispatch(setApiMessage('createUser', errors))
					);
			}
		});
	}
}

export function login(username, password) {
	return function (dispatch) {

		var credentials = {
	      "username": username,
	      "password": password
	  	};

		return fetch('/api/session', {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: "POST",
			credentials: 'include',
			body: JSON.stringify(credentials)
		})
		.then(response => {
			switch(response.status) {
				case 200:
					return response.json().then(
						session => dispatch(setSession(session))
					);

				default:
					return response.json().then(
						json => dispatch(setApiMessage('login', json))
					);
			}
		});
		
	}
}

export function logout() {
	return function (dispatch) {
		return fetch('/api/session', {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: "DELETE",
			credentials: 'include',
		})
		.then(response => response.json().then(
			session => dispatch(setSession(session))
		));
	}
}

export function setFilter(type, from, to) {

	var filter = {
		type: type
	};

	switch(type) {
		case 'week':
			filter.to = Moment();
			filter.from = filter.to.clone().subtract(1, 'week');
			break;
		case 'month':
			filter.to = Moment();
			filter.from = filter.to.clone().subtract(1, 'month');
			break;
		case 'year':
			filter.to = Moment();
			filter.from = filter.to.clone().subtract(1, 'year');
		case 'custom':
			filter.to = to;
			filter.from = from;
			break;
		default:
			//All
			filter.from = undefined;
			filter.to = undefined;
			break;

	}
	return {
		type: SET_CONFIG,
		data: {
			eventFilter: filter
		}
	}
}

function receiveEvents(json) {
	return {
		type: RECEIVE_SLEEP_EVENT,
		data: json.map(model => 
			new SleepEvent(model.id, model.preSleep, model.sleep, model.wakeUp)
		)	
	}
}

function insertSleepData(models) {
	return {
		type: INSERT_SLEEP_EVENT,
		data: models.map(model =>
			new SleepEvent(model.id, model.preSleep, model.sleep, model.wakeUp)
		)
	}
}

function updateSleepData(models) {
	return {
		type: UPDATE_SLEEP_EVENT,
		data: models.map(model =>
			new SleepEvent(model.id, model.preSleep, model.sleep, model.wakeUp)
		)
	}
}

function deleteSleepData(id) {
	return {
		type: DELETE_SLEEP_EVENT,
		data: id
	}
}

export function fetchSleepEvents() {
	return function (dispatch) {
		return fetch('/api/sleep', {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				//cache: "no-store",
				method: "GET",
				credentials: 'include'
			})
			.then(response => response.json())
			.then(json => dispatch(receiveEvents(json)))
	}
}

export function addSleepEvent(data) {
	return function (dispatch) {
		console.log('addSleepEvent');
		return fetch('/api/sleep', {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: "POST",
			credentials: 'include',
			body: JSON.stringify(data)
		})
		.then(response => response.json())
		.then(models => dispatch(insertSleepData(models)));
	}
}

export function updateSleepEvent(id, data) {
	return function (dispatch) {
		return fetch('/api/sleep/'+id, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: "PUT",
			credentials: 'include',
			body: JSON.stringify(data)
		})
		.then(response => response.json())
		.then(model => dispatch(updateSleepData([model])));
	}
}

export function deleteSleepEvent(id) {
	return function (dispatch) {
		return fetch('/api/sleep/'+id, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: "DELETE",
			credentials: 'include'
		})
		.then(response => response.json())
		.then(response => dispatch(deleteSleepData(response.id)));
	}
}

export function saveSleepForm(formData) {
	const { id, date, sleepTime, endTime, preSleepDuration } = formData;

	let baseMoment = Moment(date).startOf('day');
    let sleepMoment = baseMoment.clone().hour(sleepTime.getHours()).minute(sleepTime.getMinutes());
    let endMoment = baseMoment.clone().hour(endTime.getHours()).minute(endTime.getMinutes());
    let startMoment = sleepMoment.clone().subtract(parseInt(preSleepDuration || 0), 'minutes');

    //End time may fall into next day (if less hours than sleep)
    if(sleepTime.getHours() > endTime.getHours() ||
    	sleepTime.getHours() === endTime.getHours() && sleepTime.getMinutes() > endTime.getMinutes()) {
        endMoment.add(1, 'day');
    }

	var parsedData = {
		id: id,
        preSleep: startMoment.format(),
        sleep: sleepMoment.format(),
        wakeUp: endMoment.format()
    };

	if(id) {
		return updateSleepEvent(id, parsedData);
	} else {
		return addSleepEvent(parsedData);
	}
}