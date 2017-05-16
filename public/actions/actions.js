import Moment from 'moment'

import SleepEvent from '../helpers/SleepEvent.js';

export const SET_API_MESSAGE = 'SET_API_MESSAGE';
export const CLEAR_API_MESSAGE = 'CLEAR_API_MESSAGE';
export const RECEIVE_USER = 'RECEIVE_USER';
export const SET_CONFIG = 'SET_CONFIG';
export const RECEIVE_SLEEP_EVENT = 'RECEIVE_SLEEP_EVENT';
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

function receiveUser(user) {
	return {
		type: RECEIVE_USER,
		data: user
	}
}

export function fetchUser() {
	return function (dispatch) {

		return fetch('/api/user', {
				credentials: 'include'
			})
			.then(response => response.json())
			.then(user => dispatch(receiveUser(user)))
			.then(user => {
				if(user.data.isAuthenticated) {
					dispatch(fetchSleepEvents());
				}
			});
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
					return dispatch(fetchUser());
				default:
					return response.json().then(
						json => dispatch(setApiMessage('createUser', json))
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

		return fetch('/api/login', {
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
					return dispatch(fetchUser());
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
		return fetch('/api/logout', {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: "POST",
			credentials: 'include',
		})
		.then(response => dispatch(fetchUser()));
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

export function receiveEvents(json) {
	return {
		type: RECEIVE_SLEEP_EVENT,
		events: json.data.map(event => 
			new SleepEvent(event.id, event.startTime, event.sleepTime, event.endTime)
		)	
	}
}

export function fetchSleepEvents() {
	return function (dispatch) {
		return fetch('/api/sleep-event')
	      .then(response => response.json())
	      .then(json => dispatch(receiveEvents(json)))
	}
}

export function addSleepEvent(data) {
	return function (dispatch) {

		var newSleepEvent = {
	      "startTime": data.startTime.format('YYYY-MM-DD HH:mm'),
	      "sleepTime": data.sleepTime.format('YYYY-MM-DD HH:mm'),
	      "endTime": data.endTime.format('YYYY-MM-DD HH:mm')
	  	};

		return fetch('/api/sleep-event', {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: "POST",
			body: JSON.stringify(newSleepEvent)
		}).then(resp => dispatch(fetchSleepEvents()))
	}
}

export function updateSleepEvent(id, data) {
	return function (dispatch) {

		var updatedSleepEvent = {
	      "startTime": data.startTime.format('YYYY-MM-DD HH:mm'),
	      "sleepTime": data.sleepTime.format('YYYY-MM-DD HH:mm'),
	      "endTime": data.endTime.format('YYYY-MM-DD HH:mm')
	  	};

		return fetch('/api/sleep-event/'+id, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: "PUT",
			body: JSON.stringify(updatedSleepEvent)
		}).then(resp => dispatch(fetchSleepEvents()))
	}
}

export function deleteSleepEvent(id) {
	return function (dispatch) {
		return fetch('/api/sleep-event/'+id, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: "Delete"
		}).then(resp => dispatch(fetchSleepEvents()))
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

	let parsedData = {
        startTime: startMoment,
        sleepTime: sleepMoment,
        endTime: endMoment
    }

	if(id) {
		return updateSleepEvent(id, parsedData);
	} else {
		return addSleepEvent(parsedData);
	}
}