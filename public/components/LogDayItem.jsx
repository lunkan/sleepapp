import React, { Component, PropTypes } from 'react';
import Moment from 'frozen-moment';

import {
	grey100, grey500, grey400, darkBlack, lightBlack,
	blueGrey900, grey300,
	indigo900, blue300, blue50,
	amber700, yellow300,
	deepOrange900, pink300, pink200,
	transparent } from 'material-ui/styles/colors';

import IconUpArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import IconDownArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import IconDay from 'material-ui/svg-icons/image/wb-sunny';
import IconNight from 'material-ui/svg-icons/image/brightness-3';
import IconTime from 'material-ui/svg-icons/action/schedule';
import IconFussy from 'material-ui/svg-icons/image/flash-on';

import {ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';

import { humanizeDuration, MS_PER_DAY, MS_PER_MINUTE, MS_PER_HOUR } from '../helpers/time-formats.js';

import LogSleepItem from './LogSleepItem.jsx';

const ITEM_HEADER_HEIGHT = 90;

const styleLogDayHead = {
	flexDirection: 'row',
	display: 'flex',
	height: ITEM_HEADER_HEIGHT
}

const PresleepChip = (props) => {
	const { sleepData } = props;
	const preSleep = sleepData.filter(e => e.type === 'sleep').reduce((acc, e) => acc + e.preDuration, 0);

	if(preSleep < 30 * MS_PER_MINUTE) {
		return null;
	}

	return (
		<Chip className="chip-small" backgroundColor={pink200}>
			<Avatar color={pink200} backgroundColor={deepOrange900} icon={<IconFussy />} />
			{`Pre-sleep: ${humanizeDuration(preSleep, true)}`}
		</Chip>
	);
};

const Summary = (props) => {
	const { sleepData } = props;

	const durationHours = `${sleepData.last().ends.diff(sleepData.first().begins, 'hours')}h`;
	const nightSleepDuration = sleepData.filter(e => e.sleepType === 'night').reduce((acc, e) => acc + e.duration, 0);
	const daySleepDuration = sleepData.filter(e => e.sleepType === 'day').reduce((acc, e) => acc + e.duration, 0);

	return (
		<div>
			<Chip className="chip-small" backgroundColor={grey100}>
				<Avatar color={grey300} backgroundColor={blueGrey900} icon={<IconTime />} />
				{durationHours}
			</Chip>
			<Chip className="chip-small" backgroundColor={grey100}>
				<Avatar color={blue300} backgroundColor={indigo900} icon={<IconNight />} />
				{humanizeDuration(nightSleepDuration, true)}
			</Chip>
			<Chip className="chip-small" backgroundColor={grey100}>
				<Avatar color={yellow300} backgroundColor={amber700} icon={<IconDay />} />
				{humanizeDuration(daySleepDuration, true)}
			</Chip>
			<PresleepChip sleepData={sleepData}/>
		</div>
	);
};

const DayBadge = (props) => {
	const { dateString } = props;
	const dayMoment = Moment(dateString);
	const badgeColor = dayMoment.isoWeekday() > 5 ? pink300 : lightBlack;

	return (
		<Avatar color={badgeColor} backgroundColor={transparent} style={{left: 8}}>
			<div style={{textAlign:'center'}}>
				<div>{dayMoment.date()}</div>
				<small style={{fontSize:14}}>{dayMoment.format('ddd')}</small>
			</div>
		</Avatar>
	);
}

export default class LogDayItem extends Component {
	constructor() {
		super();

		this.state = {
    		open: false,
  		};

		this.handleToggleExpand = this.handleToggleExpand.bind(this);
	}

	static getPlaceholderHeight() {
    	return ITEM_HEADER_HEIGHT;
  	}

	componentWillMount() {
		const { data } = this.props.day;

		const sleepData = data
			.filter(o =>
				o.type === 'sleep'
				|| o.data[1].sleep.diff(o.data[0].wakeup, 'hours') < 16
				&& o.data[1].sleep.date() === o.data[0].wakeup.date()
			)
			.map(o => {
				switch(o.type) {
					case 'active':
						return {
							id: `active@${o.data[0].id}`,
							type: 'active',
							begins: o.data[0].wakeup,
							ends: o.data[1].sleep,
							duration: o.data[1].sleep.diff(o.data[0].wakeup)
						};
					case 'sleep':
						return {
							id: o.data[0].id,
							type: 'sleep',
							sleepType: o.data[0].intersectHours(22, 5) ? 'night' : 'day',
							begins: o.data[0].sleep,
							ends: o.data[0].wakeup,
							preDuration: o.data[0].preSleepDuration,
							duration: o.data[0].sleepDuration
						};
				}
			});

		this.setState({
			sleepData: sleepData
		});
	}

	handleToggleExpand() {
		this.setState({open: !this.state.open});
	}

	render() {
		const { key } = this.props.day;
		const { open, sleepData } = this.state;

		if(!sleepData.length) {
			return null;
		}

		const firstMoment = sleepData.first().begins.format('MMM D HH:mm');
		const lastMoment = sleepData.last().ends.format('MMM D HH:mm');
		const nestedItems = open ? sleepData.map(o => <LogSleepItem key={o.id} sleepData={o}/>) : [];

		return (
			<div className="sleep-event-day-item">
				<div style={styleLogDayHead} onClick={this.handleToggleExpand} >
					<DayBadge dateString={key}/>
					<div>
			  			<div>{`${firstMoment} - ${lastMoment}`}</div>
			  			<Summary sleepData={sleepData}/>
		  			</div>
		  			<IconDownArrow/>
		  		</div>
	  			<div>
	  				{nestedItems}
	  			</div>
	  		</div>
		);
	}
}