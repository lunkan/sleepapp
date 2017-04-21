import Moment from 'moment'

export const RECEIVE_SLEEP_EVENT = 'RECEIVE_SLEEP_EVENT';
export const PUT_SLEEP_FORM = 'PUT_SLEEP_FORM';
export const INIT_SLEEP_FORM = 'INIT_SLEEP_FORM';
export const SAVE_SLEEP_FORM = 'SAVE_SLEEP_FORM';

export function receiveEvents(json) {
	return {
		type: RECEIVE_SLEEP_EVENT,
		events: json.data.map(event => ({
			id: event.id,
			startTime: Moment(event.startTime),
			sleepTime: Moment(event.sleepTime),
			endTime: Moment(event.endTime)
		}))
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

//Initilize sleep form from existing event or new/empty
export function initSleepForm(eventData) {
	const {startTime, sleepTime, endTime, id} = eventData || {};

	return {
		type: INIT_SLEEP_FORM,
		data: {
			date: sleepTime ? sleepTime.toDate() : new Date(),
			sleepTime: sleepTime ? sleepTime.toDate() : null,
			endTime: endTime ? endTime.toDate() : null,
			preSleepDuration: startTime && sleepTime ? Math.round(sleepTime.diff(startTime)/60000) : 0,
		}
	}
}

export function putSleepForm(formData) {
	return {
		type: PUT_SLEEP_FORM,
		data: data
	}
}

export function saveSleepForm(formData) {
	const { id, date, sleepTime, endTime, preSleepDuration } = formData;

	let baseMoment = Moment(date).startOf('day');
    let sleepMoment = baseMoment.clone().hour(sleepTime.getHours()).minute(sleepTime.getMinutes());
    let endMoment = baseMoment.clone().hour(endTime.getHours()).minute(endTime.getMinutes());
    let startMoment = sleepMoment.clone().substract(parseInt(preSleepDuration || 0) * 60000, 'm');

    //End time may fall into next day (if less hours than sleep)
    if(sleepTime.getHours() > endTime.getHours()) {
        endMoment.add(1, 'd');
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