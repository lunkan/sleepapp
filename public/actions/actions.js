import Moment from 'moment'

export const RECEIVE_SLEEP_EVENT = 'RECEIVE_SLEEP_EVENT';
export const ADD_SLEEP_EVENT = 'ADD_SLEEP_EVENT';
export const UPDATE_SLEEP_EVENT = 'UPDATE_SLEEP_EVENT';
export const DELETE_SLEEP_EVENT = 'DELETE_SLEEP_EVENT';
export const ADD_POOP_EVENT = 'ADD_POOP_EVENT';

const MILLISEC_HOUR = 1000 * 60 * 60;
const MILLISEC_MINUTE = 1000 * 60;

let nextSleepEventId = 0;

function isNightSleep(data) {
	return parseInt(data.startTime.format('H')) < 8 || parseInt(data.startTime.format('H')) > 18; 
}

function formatTimeDifference(momentA, momentB) {
	let difference = momentB.diff(momentA);
	let hours = Math.floor(difference / MILLISEC_HOUR);
	let minutes = Math.floor((difference - hours * MILLISEC_HOUR) / MILLISEC_MINUTE);

	if(hours > 0) {
		return hours + 'h ' + minutes + 'm';
	} else {
		return minutes + 'm';
	}
}

function formatDuration(data) {
	return {
		sleep: data.endTime.diff(data.sleepTime) / 60000,
		preSleep: data.sleepTime.diff(data.startTime) / 60000,
	}
}

function formatData(data) {
	return {
		date: data.startTime.format('dddd, MMMM Do'),
		sleepTime: data.sleepTime.format('HH:mm'),
		sleepDuration: formatTimeDifference(data.sleepTime, data.endTime),
		preSleepTime: data.startTime.format('HH:mm'),
		preSleepDuration: formatTimeDifference(data.startTime, data.sleepTime)
	}
}


export function receiveEvents(json) {
	return {
		type: RECEIVE_SLEEP_EVENT,
		events: json.data.map(event => ({
			id: event.id,
			startTime: Moment(event.startTime),
			sleepTime: Moment(event.sleepTime),
			endTime: Moment(event.endTime)
		})).map(event => ({
			id: event.id,
			data: event,
			duration: formatDuration(event),
			formattedData: formatData(event),
			isNightSleep: isNightSleep(event)
		})),
		receivedAt: Date.now()
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
	console.log('addSleepEvent', data);
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