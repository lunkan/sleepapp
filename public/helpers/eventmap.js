import Moment from 'moment'

const MILLISEC_PER_DAY = 86400000;
const MILLISEC_PER_HOUR = 3600000;
const MILLISEC_PER_MINUTE = 60000;

export default class EventMap {
	constructor(sleepEvents) {
		this.dayKeys = new Map(); 
    	this.dayMap = new Map();
    	this.keyIndex = 1;

    	if(Array.isArray(sleepEvents) && sleepEvents.length > 0) {

			sleepEvents.forEach(e => {
				this.put(e.sleepTime, e);

				if(e.sleepTime.get('date') !== e.endTime.get('date')) {
					this.put(e.endTime, e);
				}
			});	
		}
  	}

  	put(moment, data) {
  		var keyId = moment.format('DDD YYYY');
		var dayKey = this.dayKeys.get(keyId);
		if(!dayKey) {
			dayKey = moment.clone().startOf('day');
			this.dayKeys.set(keyId, dayKey);
		}
		
		var value = this.dayMap.get(dayKey) || [];
		value.push(data);
		this.dayMap.set(dayKey, value);
  	}

	getSleepType(startMoment, endMoment, dayMoment) {
		if(dayMoment.date() !== startMoment.date()) {
			return 'dusk';
		} else if (dayMoment.date() !== endMoment.date()) {
			return 'dawn';
		} else {
			var hour = parseInt(startMoment.format('H'));
			return (hour > 18 || hour < 6) ? 'night' : 'day';	
		}
	}

	formatDuration(ms, format) {
		var hours = String(Math.floor(ms / 3600000));
		var minutes = String(Math.floor((ms % 3600000) / MILLISEC_PER_MINUTE));

		if(hours === "1") {
			hours += format === 'short' ? 'h' : " hour";
		} else {
			hours += format === 'short' ? 'h' : " hours";
		}

		if(minutes === "1") {
			minutes += format === 'short' ? 'm' : " minute";
		} else {
			minutes += format === 'short' ? 'm' : " minutes";
		}

		var concatString = format === 'short' ? ' ' : " and ";

		return hours + concatString + minutes;
	}

	sumDaySleep(dateMoment, events) {
		var sumSleep = 0;

		events.forEach(e => {
			if(e.sleepTime.date() === e.endTime.date()) {
				sumSleep += e.endTime.diff(e.sleepTime);
			} else if (e.sleepTime.date() == dateMoment.date()) {
				sumSleep += e.sleepTime.clone().endOf('day').diff(e.sleepTime);
			} else {
				sumSleep += e.endTime.diff(e.endTime.clone().startOf('day'));
			}
		});

		return "Slept " + this.formatDuration(sumSleep); 
	}

	sumDetails(dateMoment, events) {
		var sumActiveTime = MILLISEC_PER_DAY;
		var sumPreSleep = 0;

		events.forEach(e => {
			if(e.sleepTime.date() === e.endTime.date()) {
				sumActiveTime -= e.endTime.diff(e.sleepTime);
			} else if (e.sleepTime.date() == dateMoment.date()) {
				sumActiveTime -= e.sleepTime.clone().endOf('day').diff(e.sleepTime);
			} else {
				sumActiveTime -= e.endTime.diff(e.endTime.clone().startOf('day'));
			}
		});

		events.forEach(e => {
			if(e.sleepTime.date() === e.endTime.date()) {
				sumPreSleep += e.sleepTime.diff(e.startTime);
			} else if (e.sleepTime.date() == dateMoment.date()) {
				sumPreSleep += e.sleepTime.diff(e.startTime);
			}
		});

		return "Active: " + this.formatDuration(sumActiveTime, 'short') + ", Pre-sleep: " + this.formatDuration(sumPreSleep, 'short');
	}

	daySort(a, b) {
  		return b.label.localeCompare(a.label);
  	}

  	eventSort(a, b) {
  		return b.startTime.diff(a.startTime);
  	}

  	toNestedArray() {

  		return [...this.dayMap].map(([dayMoment, events]) => ({
				key: dayMoment.unix(),
	  			label: dayMoment.format('D'),
	  			isWeekend: parseInt(dayMoment.format('d')) >= 5,
	  			week: 'Week ' + dayMoment.format('W') + ' ' + dayMoment.format('MMM YYYY'),
	  			weekLabel: dayMoment.format('ddd'),  
	  			summary: this.sumDaySleep(dayMoment, events),
	  			details: this.sumDetails(dayMoment, events), 
	  			data: events.map(event => {
	  				return Object.assign({
	  					duration: this.formatDuration(event.endTime.diff(event.sleepTime)),
	  					sleepType: this.getSleepType(event.sleepTime, event.endTime, dayMoment)
	  				}, event);
	  			}).sort(this.eventSort)
	  		})).sort(this.daySort).group(day => day.week);
  	}
}