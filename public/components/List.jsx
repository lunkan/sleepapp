import React, { Component, PropTypes } from 'react';
import LazyLoad from 'react-lazy-load';

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
import {Card, CardText} from 'material-ui/Card';

import SleepEvent from '../helpers/SleepEvent.js';

import PageHeader from './PageHeader.jsx';
import LogWeekItem from './LogWeekItem.jsx';

class EventLog extends Component {

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
			    { sleepEvents.map(week => <LogWeekItem key={week.key} weekDate={week.key} days={week.data}/>) }   
			</div>
		);
	}
}

function select(state) {
	const { from, to } = state.config.eventFilter;
	const { sleepEvents } = state;
	var selectedEvents = sleepEvents.filter(e => e.intersect(from, to))

		//Format data and fill time gaps between sleep events with active events
		//If active time not considered incomplete (missing data) 
		.reduce((acc, next) => {
			const preEvent = acc.last();//(acc.last() || {});

			//Ignore if active time start/end is not same day or to long
			if(preEvent
				&& preEvent.type === 'sleep'
				&& next.sleep.date() === preEvent.data[0].wakeup.date() ) {

				acc.push({
					type: 'active',
					date: preEvent.data[0].wakeup.startOf('day').format(),
					data: [preEvent.data[0], next]
				});
			}

			acc.push({
				type: 'sleep',
				date: next.sleep.startOf('day').format(),
				data: [next]
			});

			return acc;

		}, [])
		.group(e => e.date)
		.group(g => Moment(g.key).startOf('isoweek').format());

	return {
		sleepEvents: selectedEvents
	}
}

export default connect(select)(EventLog)