import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

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

import PageHeader from './PageHeader.jsx';

import EventMap from '../helpers/eventmap.js';

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
	  	const { sleepType, sleepTime, endTime } = sleepEvent;
	  	const fromStyle = sleepType === 'dusk' ? {color:lightBlack} : {};
	  	const toStyle = sleepType === 'dawn' ? {color:lightBlack} : {};

	  	return (<span>
	  		<span style={fromStyle}>{sleepTime.format('HH:mm')}</span>
	  		&nbsp;-&nbsp;
	  		<span style={toStyle}>{endTime.format('HH:mm')}</span>
	  	</span>);
	}

	EventLogSleepEvent(sleepEvent) {
	  	const { id, duration } = sleepEvent;

	  	return (<ListItem key={id}
	  		primaryText={this.EventLogSleepEventText(sleepEvent)}
			secondaryText={duration}
			leftIcon={this.EventLogSleepEventIcon(sleepEvent)}
			rightIconButton={this.EventLogSleepEventMenu(sleepEvent)} />);
	}

	EventLogDayBadge(day) {
		const { isWeekend, weekLabel, label } = day;
		const badgeColor = isWeekend ? pinkA200 : lightBlack;

		return (<Avatar color={badgeColor} backgroundColor={transparent} style={{left: 8}}>
			<div style={{textAlign:'center'}}>
				<div>{label}</div>
				<small style={{fontSize:14}}>{weekLabel}</small>
			</div>
		</Avatar>);
	}

	EventLogDay(day) {
		const { key, summary, details, data } = day;

	  	return (<div key={key}>
	  		<ListItem
	  			primaryText={summary}
	  			secondaryText={details}
	  			leftAvatar={this.EventLogDayBadge(day)}
	  			nestedItems={data.map(this.EventLogSleepEvent)} />
		    <Divider inset={true} />
		</div>);
	}

	EventLogWeek(week) {
		const { key, data } = week;

		return (<List key={key}>
	  		<Subheader style={{fontFamily:"Roboto"}}>{key}</Subheader>
	  		{data.map(this.EventLogDay)}
	  	</List>);
	}

	render() {
		const { eventMap } = this.props;

		return (
			<div>
				<PageHeader pageTitle="Sleep log"/>
				{eventMap.map(this.EventLogWeek)}
			</div>);
	}
}

function select(state) {
	var eventMap = new EventMap(state.sleepEvents);

	return {
		eventMap: eventMap.toNestedArray()
	}
}

export default connect(select)(EventLog)