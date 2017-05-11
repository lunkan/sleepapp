import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'frozen-moment';

import {
	grey100, grey500, grey400, darkBlack, lightBlack,
	blueGrey900, grey300,
	indigo900, blue300, blue50,
	amber700, yellow300,
	deepOrange900, pink300, pink200,
	transparent } from 'material-ui/styles/colors';

import IconInfo from 'material-ui/svg-icons/action/info'; 
import IconDay from 'material-ui/svg-icons/image/wb-sunny';
import IconNight from 'material-ui/svg-icons/image/brightness-3';
import IconTime from 'material-ui/svg-icons/action/schedule';
import IconFussy from 'material-ui/svg-icons/image/flash-on';

import {Card, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';

import SleepEvent from '../helpers/SleepEvent.js';
import { humanizeDuration, MS_PER_DAY, MS_PER_MINUTE, MS_PER_HOUR } from '../helpers/time-formats.js';

import PageHeader from './PageHeader.jsx';

const badgeSmall = {

}

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

	EventLogSleepEventMenu(o) {
	  	const { id } = o;

	  	return (<IconMenu iconButtonElement={this.EventLogSleepEventMenuIcon()}>
	  		<MenuItem>
	  			<Link to={{pathname: '/edit/' + id, state: { modal: true }}}>Edit</Link>
	  		</MenuItem>
	  		<MenuItem>
	  			<Link to={{pathname: '/delete/' + id, state: { modal: true }}}>Delete</Link>
	  		</MenuItem>
	  	</IconMenu>);
	}

	EventLogSleepEventIcon(o) {
		const { sleepType } = o;

		switch(sleepType) {
			case 'day': return (<IconDay/>);
			case 'night': return (<IconNight/>);
			default: return undefined;//(<IconDay className='icon-dawn'/>);
		}
	}

	EventLogSleepEventText(o) {
	  	const { begins, ends } = o;

	  	return (<span>
	  		<span>{begins.format('HH:mm')}</span>
	  		&nbsp;-&nbsp;
	  		<span>{ends.format('HH:mm')}</span>
	  	</span>);
	}

	EventLogSleepEvent(o) {
	  	const { id, duration, type, sleepType } = o;

	  	switch(type) {
	  		case 'active':
	  			const activeContainerStyle = {
	  				padding: 4,
	  				paddingLeft: 90,
	  				fontFamily:"Roboto",
	  				backgroundColor: grey300,
	  				fontSize: 14
	  			};

				return (<div style={activeContainerStyle}>{humanizeDuration(duration)}</div>);
	  		case 'sleep':
				return (<ListItem key={id}
			  		primaryText={this.EventLogSleepEventText(o)}
					secondaryText={humanizeDuration(duration)}
					leftIcon={this.EventLogSleepEventIcon(o)}
					rightIconButton={type === 'sleep' ? this.EventLogSleepEventMenu(o) : null} />);

	  	}

	  	
	}

	EventLogDayBadge(day) {
		const badgeColor = day.isoWeekday() > 5 ? pink300 : lightBlack;

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
		const firstMoment = data.first().begins.format('MMM D HH:mm');
		const lastMoment = data.last().ends.format('MMM D HH:mm');
		const durationHours = `${data.last().ends.diff(data.first().begins, 'hours')}h`;
		const preSleep = data.filter(e => e.type === 'sleep').reduce((acc, e) => acc + e.preDuration, 0);
		const nightSleepDuration = data.filter(e => e.sleepType === 'night').reduce((acc, e) => acc + e.duration, 0);
		const daySleepDuration = data.filter(e => e.sleepType === 'day').reduce((acc, e) => acc + e.duration, 0);

		const summary = `${firstMoment} - ${lastMoment}`;

		var PresleepChip;

		if(preSleep > 30 * MS_PER_MINUTE) {
			const preSleepLabel = `Pre-sleep: ${humanizeDuration(preSleep, true)}`;
			PresleepChip = (<Chip className="chip-small" backgroundColor={pink200}>
				<Avatar color={pink200} backgroundColor={deepOrange900} icon={<IconFussy />} />
				{preSleepLabel}
			</Chip>);
		}

		const SummaryComponent = (<div>
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
			{PresleepChip}
			
		</div>);

	  	return (<div key={dayMoment.unix()}>
	  		<ListItem className="sleep-event-day-item"
	  			primaryText={summary}
	  			secondaryText={SummaryComponent}
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

		const infoBoxOuterStyle = {
			backgroundColor: blue50
		};

		const infoBoxInnerStyle = {
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center'
		};

		return (
			<div>
				<PageHeader pageTitle="Sleep log"/>
				<Card style={infoBoxOuterStyle}>
			        <CardText style={{paddingBottom:6}}>
			        	<div style={infoBoxInnerStyle}>
				        	<IconInfo color={blue300} style={{marginRight:5}}/>
				        	<div>A day is considered starting when the first active period begins after 00:00,
				        	and ends at the first wakeup time the following day.</div>
			        	</div>
			        </CardText>
			    </Card>    
				{sleepEvents.map(this.EventLogWeek)}
			</div>);
	}
}

function select(state) {
	const { from, to } = state.config.eventFilter;
	const { sleepEvents } = state;

	var selectedEvents = sleepEvents.filter(e => e.intersect(from, to))

		//Format data and fill time gaps between sleep events with active events
		//If active time not considered incomplete (missing data) 
		.reduce((acc, next) => {
			const preEvent = (acc.last() || {});

			//Ignore if active time start/end is not same day or to long
			if(preEvent.type === 'sleep'
				&& next.sleep.diff(preEvent.ends, 'hours') < 16
				&& next.sleep.date() === preEvent.ends.date() ) {

				acc.push({
					id: `active@${preEvent.id}`,
					type: 'active',
					begins: preEvent.ends,
					ends: next.sleep,
					duration: next.sleep.diff(preEvent.ends)
				});
			}

			acc.push({
				id: next.id,
				type: 'sleep',
				sleepType: next.intersectHours(22, 5) ? 'night' : 'day',
				begins: next.sleep,
				ends: next.wakeup,
				preDuration: next.preSleepDuration,
				duration: next.sleepDuration
			});

			return acc;

		}, [])
		.group(e => e.begins.startOf('day').format())
		.sort((a, b) => Moment(b.key).diff(Moment(a.key)))
		.group(g => Moment(g.key).startOf('isoweek').format());

	return {
		sleepEvents: selectedEvents
	}
}

export default connect(select)(EventLog)