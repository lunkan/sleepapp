import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'frozen-moment';

import { grey500, grey400, darkBlack, lightBlack, pinkA200, transparent } from 'material-ui/styles/colors';
import IconDay from 'material-ui/svg-icons/image/wb-sunny';
import IconNight from 'material-ui/svg-icons/image/brightness-3';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import Avatar from 'material-ui/Avatar';

import SleepEvent from '../helpers/SleepEvent.js';
import { humanizeDuration, MS_PER_DAY } from '../helpers/time-formats.js';

import PageHeader from './PageHeader.jsx';

class EventLog extends Component {
	constructor() {
		super();

		this.state = {}

		this.EventLogSleepEventMenuIcon = this.EventLogSleepEventMenuIcon.bind(this);
		this.EventLogSleepEventMenu = this.EventLogSleepEventMenu.bind(this);
		this.EventLogSleepEventIcon = this.EventLogSleepEventIcon.bind(this);
		this.EventLogSleepEventText = this.EventLogSleepEventText.bind(this);
		this.EventLogSleepEvent = this.EventLogSleepEvent.bind(this);
		this.EventLogDayBadge = this.EventLogDayBadge.bind(this);
		this.EventLogDay = this.EventLogDay.bind(this);
		this.EventLogWeek = this.EventLogWeek.bind(this);
	}
 
	EventLogSleepEventMenuIcon() {
		return (<IconButton touch={true} tooltip="more" tooltipPosition="bottom-left">
		    <MoreVertIcon color={grey400} />
		</IconButton>);
	}

	EventLogSleepEventMenu(sleepEvent) {
	  	const { id } = sleepEvent;

	  	return (<IconMenu iconButtonElement={this.EventLogSleepEventMenuIcon()}>
	  		<MenuItem>
	  			<Link to={{pathname: '/edit/' + id, state: { modal: true }}}>Edit</Link>
	  		</MenuItem>
	  		<MenuItem>
	  			<Link to={{pathname: '/delete/' + id, state: { modal: true }}}>Delete</Link>
	  		</MenuItem>
	  	</IconMenu>);
	}

	EventLogSleepEventIcon(sleepEvent) {
		const { sleepType } = sleepEvent;

		switch(sleepType) {
			case 'day': return (<IconDay/>);
			case 'night': return (<IconDay/>);
			default: return (<IconDay className='icon-dawn'/>);
		}
	}

	EventLogSleepEventText(sleepEvent) {
	  	const { sleep, wakeup } = sleepEvent;

	  	return (<span>
	  		<span>{sleep.format('HH:mm')}</span>
	  		&nbsp;-&nbsp;
	  		<span>{wakeup.format('HH:mm')}</span>
	  	</span>);
	}

	EventLogSleepEvent(sleepEvent) {
	  	const { id, duration } = sleepEvent;

	  	return (<ListItem key={id}
	  		primaryText={this.EventLogSleepEventText(sleepEvent)}
			secondaryText={humanizeDuration(duration)}
			leftIcon={this.EventLogSleepEventIcon(sleepEvent)}
			rightIconButton={this.EventLogSleepEventMenu(sleepEvent)} />);
	}

	EventLogDayBadge(day) {
		const badgeColor = day.isoWeekday() > 5 ? pinkA200 : lightBlack;

		return (<Avatar color={badgeColor} backgroundColor={transparent} style={{left: 8}}>
			<div style={{textAlign:'center'}}>
				<div>{day.date()}</div>
				<small style={{fontSize:14}}>{day.format('ddd')}</small>
			</div>
		</Avatar>);
	}

	EventLogDay(day) {
		const { key, data } = day;

		const dayMoment = Moment(key);
		const preSleep = data.reduce((acc, e) => acc + e.preSleepDuration, 0);
		const sleep = data.reduce((acc, e) => acc + e.sleepDuration, 0);
		const active = MS_PER_DAY - (preSleep + sleep);

		const summary = `Slept ${humanizeDuration(sleep)}`;
		const details = `Active: ${humanizeDuration(active, true)}, 
			Pre-sleep: ${humanizeDuration(preSleep, true)}`;

	  	return (<div key={dayMoment.unix()}>
	  		<ListItem
	  			primaryText={summary}
	  			secondaryText={details}
	  			leftAvatar={this.EventLogDayBadge(dayMoment)}
	  			nestedItems={data.map(this.EventLogSleepEvent)} />
		    <Divider inset={true} />
		</div>);
	}

	EventLogWeek(week) {
		const weekMoment = Moment(week.key);
		const weekNumber = weekMoment.format('W');
		const monthYear = weekMoment.format('MMM YYYY');

		return (<List key={weekMoment.unix()}>
	  		<Subheader style={{fontFamily:"Roboto"}}>
	  			{ `Week ${weekNumber} ${monthYear}` }
	  		</Subheader>
	  		{week.data.map(this.EventLogDay)}
	  	</List>);
	}

	render() {
		const { sleepEvents } = this.props;

		return (
			<div>
				<PageHeader pageTitle="Sleep log"/>
				{sleepEvents.map(this.EventLogWeek)}
			</div>);
	}
}

function select(state) {
	const { from, to } = state.config.eventFilter;
	const { sleepEvents } = state;

	var selectedEvents = sleepEvents.filter(e => e.intersect(from, to))
		.reduce((acc, e) => acc.concat(e.breakApart(0)), [])
		.group(e => e.preSleep.startOf('day').format())
		.sort((a, b) => Moment(b.key).diff(Moment(a.key)))
		.group(g => Moment(g.key).startOf('isoweek').format());

	return {
		sleepEvents: selectedEvents
	}
}

export default connect(select)(EventLog)