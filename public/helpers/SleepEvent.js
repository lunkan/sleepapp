//import Moment from 'moment'
import Moment from 'frozen-moment';

export default class SleepEvent {

	constructor(id, startTimestamp, sleepTimestamp, endTimestamp) {
		this.id = id;
		this.preSleep = Moment(startTimestamp).freeze(); 
    	this.sleep = Moment(sleepTimestamp).freeze();
    	this.wakeup = Moment(endTimestamp).freeze();
  	}

  	get sleepType() {
  		if(this.sleep.format('HH:mm') == '00:00') {
  			return 'dawn';
  		} else if(this.wakeup.format('HH:mm') == '00:00') {
  			return 'dusk';
  		} else {
  			return 'day';
  		}
  	}

  	get duration() {
  		return this.wakeup.diff(this.preSleep);
  	}

	get sleepDuration() {
		return this.wakeup.diff(this.sleep);
	}

	get preSleepDuration() {
		return this.sleep.diff(this.preSleep);
	}

	contains(moment) {
		return this.preSleep.diff(moment) < 0 && this.wakeup.diff(moment) > 0;
	}

	intersectHours(from, to) {
		return this.getMomentByHour(from) || this.getMomentByHour(to);
	}

	getMomentByHour(hour) {
		var breakMoment = this.preSleep.startOf('day').add(hour, 'hour');

		//May contain at minimum 2 occations (more if sleepduration is longer than)
		for(let i = 0; i < 2; i++) {
			if(this.contains(breakMoment)) {
				return breakMoment;
			}

			breakMoment = breakMoment.add(1, 'day');
		}

		return null;
	}

	intersect(from = Moment(new Date(0)), to = Moment()) {
		return this.preSleep.diff(from) >= 0 && this.wakeup.diff(to) <= 0;
	}

  	//hh:mm
	breakApart(hour) {

		var breakMoment = this.getMomentByHour(hour);

		if(breakMoment) {
			return [new SleepEvent(
					this.id,
					this.preSleep.format(),
					Moment.min(this.sleep, breakMoment).format(),
					Moment.min(this.wakeup, breakMoment).format()
				), new SleepEvent(
					this.id,
					Moment.max(this.preSleep, breakMoment).format(),
					Moment.max(this.sleep, breakMoment).format(),
					this.wakeup.format()
				)];
		} else {
			return [this];
		}
	}

	
}