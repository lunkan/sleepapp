import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router-dom';

import {
	grey100, grey500, grey400, darkBlack, lightBlack,
	blueGrey900, grey300,
	indigo900, blue300, blue50,
	amber700, yellow300,
	deepOrange900, pink300, pink200,
	transparent } from 'material-ui/styles/colors';

import IconDay from 'material-ui/svg-icons/image/wb-sunny';
import IconNight from 'material-ui/svg-icons/image/brightness-3';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import {ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import { humanizeDuration } from '../helpers/time-formats.js';


const styleInfo = {
	flexGrow: 1,
	boxSizing: 'border-box'
}

//Styles
const styleContainer = {
	flexDirection: 'row',
	alignItems: 'center',
	display: 'flex',
	fontFamily:"Roboto",
	boxSizing: 'border-box',
	paddingTop: 8,
	paddingBottom: 8
}

const activeContainerStyle = {
	padding: 4,
	paddingLeft: 72,
	fontFamily:"Roboto",
	backgroundColor: grey300,
	fontSize: 14
};

const styleTypeIcon = {
	paddingLeft: 24,
	paddingRight: 24
}

const styleDetails = {
	color: lightBlack,
	fontSize: 14
}

class OptionMenu extends Component {
	render() {
	  	const { id } = this.props;

	  	return (
	  		<IconMenu iconButtonElement={
	  				<IconButton touch={true} tooltip="more" tooltipPosition="bottom-left">
			    		<MoreVertIcon color={grey400} />
					</IconButton>
				}>
		  		<MenuItem>
		  			<Link to={{pathname: '/edit/' + id, state: { modal: true }}}>Edit</Link>
		  		</MenuItem>
		  		<MenuItem>
		  			<Link to={{pathname: '/delete/' + id, state: { modal: true }}}>Delete</Link>
		  		</MenuItem>
		  	</IconMenu>
	  	);
	}
}

function TypeIcon(props) {
	const { sleepType } = props;

	switch(sleepType) {
		case 'day': return (<IconDay style={styleTypeIcon}/>);
		case 'night': return (<IconNight style={styleTypeIcon}/>);
		default: return undefined;
	}
}

function Label(props) {
  	const { begins, ends } = props;

  	return (
  		<div>
  			<span>{begins.format('HH:mm')}</span>&nbsp;-&nbsp;<span>{ends.format('HH:mm')}</span>
  		</div>
  	);
}

//Component
export default class LogSleepItem extends Component {
	render() {
		const { id, duration, type, sleepType, begins, ends } = this.props.sleepData;

		switch(type) {
	  		case 'active':
				return (<div key={id} style={activeContainerStyle}>{humanizeDuration(duration)}</div>);
	  		case 'sleep':
				return (
					<div style={styleContainer}>
						<TypeIcon sleepType={sleepType}/>
						<div style={styleInfo}>
							<Label begins={begins} ends={ends}/>
							<div style={styleDetails}>{humanizeDuration(duration)}</div>
						</div>
						<OptionMenu id={id}/>
					</div>
				);
	  	}
	}
}