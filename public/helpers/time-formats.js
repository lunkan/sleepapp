import Moment from 'moment';

export const MS_PER_MINUTE = 60000;
export const MS_PER_HOUR = 3600000;
export const MS_PER_DAY = 86400000;

export function humanizeDuration(ms, useShortFormat = false) {
	const hourVal = Math.floor(ms/MS_PER_HOUR);
	const minuteVal = Math.floor((ms % MS_PER_HOUR) / MS_PER_MINUTE);

	if(useShortFormat) {
		return hourVal > 0 ? `${hourVal}h ${minuteVal}m` : `${minuteVal}m`;
	} else {
		const hourTerm = hourVal > 1 ? 'hours' : 'hour';
		const minuteTerm = minuteVal !== 1 ? 'minutes' : 'minute';

		return hourVal > 0 ? `${hourVal} ${hourTerm} and ${minuteVal} ${minuteTerm}` : `${minuteVal} ${minuteTerm}`;
	}
}