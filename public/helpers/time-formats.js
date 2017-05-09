import Moment from 'moment';

export const MS_PER_MINUTE = 60000;
export const MS_PER_HOUR = 3600000;
export const MS_PER_DAY = 86400000;

export function humanizeDuration(ms, useShortFormat = false) {
	const hourVal = Math.floor(ms/MS_PER_HOUR);
	const minuteVal = Math.floor((ms % MS_PER_HOUR) / MS_PER_MINUTE);
	const hourTerm = useShortFormat ? 'h' : hourVal > 1 ? 'hours' : 'hour';
	const minuteTerm = useShortFormat ? 'm' : minuteVal > 1 ? 'minutes' : 'minute';

	if(hourVal > 0) {
		return `${hourVal} ${hourTerm} and ${minuteVal} ${minuteTerm}`;
	} else {
		return `${minuteVal} ${minuteTerm}`;
	}
}