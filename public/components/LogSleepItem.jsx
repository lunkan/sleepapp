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

//Styles
const styleContainer = {
	flexDirection: 'row',
	display: 'flex',
}

const activeContainerStyle = {
	padding: 4,
	paddingLeft: 90,
	fontFamily:"Roboto",
	backgroundColor: grey300,
	fontSize: 14
};

//Elements
function OptionMenuIcon() {
	return (
		<IconButton touch={true} tooltip="more" tooltipPosition="bottom-left">
	    	<MoreVertIcon color={grey400} />
		</IconButton>
	);
}

function OptionMenu(props) {
  	const { id } = props;

  	return (
  		<IconMenu iconButtonElement={<OptionMenuIcon/>}>
	  		<MenuItem>
	  			<Link to={{pathname: '/edit/' + id, state: { modal: true }}}>Edit</Link>
	  		</MenuItem>
	  		<MenuItem>
	  			<Link to={{pathname: '/delete/' + id, state: { modal: true }}}>Delete</Link>
	  		</MenuItem>
	  	</IconMenu>
  	);
}

function TypeIcon(props) {
	const { sleepType } = props;

	switch(sleepType) {
		case 'day': return (<IconDay/>);
		case 'night': return (<IconNight/>);
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
						<div>
							<Label begins={begins} ends={ends}/>
							<div>{humanizeDuration(duration)}</div>
						</div>
					</div>
				);
	  	}
	}
}