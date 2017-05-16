import React, { Component, PropTypes } from 'react';
import LazyLoad from 'react-lazy-load';
import Moment from 'frozen-moment';

import {
	grey100, grey500, grey400, darkBlack, lightBlack,
	blueGrey900, grey300,
	indigo900, blue300, blue50,
	amber700, yellow300,
	deepOrange900, pink300, pink200,
	transparent } from 'material-ui/styles/colors';

import LogDayItem from './LogDayItem.jsx';

const styleLabel = {
	fontFamily:"Roboto",
	color: lightBlack,
    fontSize: 14,
    fontWeight: 500,
	padding: 16,
	paddingTop: 32
}

export default class LogWeekItem extends Component {
	constructor() {
		super();

		this.state = {
			containerHeight: 0,
			loaded: false
		}

		this.onLazyLoaded = this.onLazyLoaded.bind(this);
	}

	componentWillMount() {
		const { days } = this.props;

		this.setState({
			containerHeight: days.length * LogDayItem.getPlaceholderHeight(),
			sortedDays: days.sort((a, b) => Moment(b.key).diff(Moment(a.key)))
		});
	}

	onLazyLoaded() {
		this.setState({
			loaded: true,
			containerHeight: 'auto'
		});
	}

	render() {
		const { weekDate, days } = this.props;
		const { containerHeight, sortedDays } = this.state;

		const weekMoment = Moment(weekDate);
		const weekNumber = weekMoment.format('W');
		const monthYear = weekMoment.format('MMM YYYY');

		return (
			<div>
	  			<div style={styleLabel}>{`Week ${weekNumber} ${monthYear}`}</div>
	  			<LazyLoad onContentVisible={this.onLazyLoaded} height={containerHeight} offset={500} once>
	  				<div>
	  					{sortedDays.map(day => <LogDayItem key={day.key} day={day}/>)}
	  				</div>
	  			</LazyLoad>
	  		</div>
	  	);
	}
}