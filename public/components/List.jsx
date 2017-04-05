import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Moment from 'moment'

import { grey500, grey400, darkBlack, lightBlack } from 'material-ui/styles/colors';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconAdd from 'material-ui/svg-icons/content/add';
import IconFilter from 'material-ui/svg-icons/content/filter-list';
import IconDay from 'material-ui/svg-icons/image/wb-sunny';
import IconNight from 'material-ui/svg-icons/image/brightness-3';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import Avatar from 'material-ui/Avatar';
import {pinkA200, transparent} from 'material-ui/styles/colors';

import { addSleepEvent, updateSleepEvent, deleteSleepEvent } from '../actions/actions'

import AddSleepEvent from './AddSleepEvent.jsx'

const MILLISEC_PER_DAY = 86400000;
const MILLISEC_PER_HOUR = 3600000;
const MILLISEC_PER_MINUTE = 60000;


class ListEvents extends Component {

constructor() {
      super();

      this.state = {
      	formData: null,
         dialogOpen: false,
         dialogAction: null,
    	dialogId: null
      }

      this.handleOpen = this.handleOpen.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.onDialogFormUpdate = this.onDialogFormUpdate.bind(this);
   }

	handleOpen(action, id) {
		const { events } = this.props
		let event;

		if(id) {
			event = events.find(event => event.id === id)
		}

    this.setState({
    	dialogOpen: true,
    	dialogAction: action,
    	dialogId: typeof event === 'object' ? event.id : null
    });
  }

  handleClose(action) {
  	const {dialogId, dialogAction, formData} = this.state;
  	const {dispatch} = this.props;

	if(action === 'confirm') {
		switch(dialogAction) {
			case 'add':
				dispatch(addSleepEvent(formData))
				break;
			case 'edit':
				dispatch(updateSleepEvent(dialogId, formData))
				break;
			case 'delete':
				dispatch(deleteSleepEvent(dialogId))
				break;
		}
	}

    this.setState({
    	formData: null,
    	dialogOpen: false,
		dialogAction: null,
    	dialogId: null
    });
  }

  onDialogFormUpdate(data) {
  	this.setState({formData: {
	     startTime: Moment(data.startTime),
	     sleepTime: Moment(data.sleepTime),
	     endTime: Moment(data.endTime),
	  }})
  }

render() {
	const { dispatch, eventMap, events } = this.props;
	const { dialogId, dialogAction, dialogOpen } = this.state;
	const dialogData = (events.find(event => event.id === dialogId) || {}).data;

	const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={e => this.handleClose('cancel')} />,
      <FlatButton
        label="Submit"
        primary={true}
        onTouchTap={e => this.handleClose('confirm')} />,
    ];

	const iconButtonElement = (
	  <IconButton
	    touch={true}
	    tooltip="more"
	    tooltipPosition="bottom-left"
	  >
	    <MoreVertIcon color={grey400} />
	  </IconButton>
	);

	let dialog = null;

	switch(dialogAction) {
		case "delete":
			dialog = <Dialog
			title="Delete sleep event"
      		actions={actions}
      		modal={true}
      		open={dialogOpen}>
      			{'Are you sure you want to delete ' + dialogData.sleepTime.format('dddd, MMMM Do HH:mm') + '?' } 
    		</Dialog>
			break;
		default:
			dialog = <Dialog
			title={dialogAction === 'add' ?  'Add event' : 'Edit event' }
      		actions={actions}
      		modal={true}
      		open={dialogOpen}>
      			<AddSleepEvent editData={dialogData} onUpdate={this.onDialogFormUpdate}/>
    		</Dialog>
			break;
	}

	return (
		<div>
			<Toolbar>
				<ToolbarGroup>
          			<ToolbarTitle text="Event log" />
				</ToolbarGroup>
				<ToolbarGroup>
          			<RaisedButton
					      label="New sleep event"
					      labelPosition="before"
					      onTouchTap={e => this.handleOpen('add')}
					      primary={true}
					      icon={<IconAdd />}/>
				</ToolbarGroup>
			</Toolbar>

		{
			eventMap.map(month => 
				<List key={month.key}>
					<Subheader style={{fontFamily:"Roboto"}}>{month.key}</Subheader>
					{
						month.data.map(day =>
							<div key={day.key}>
								<ListItem
	                  				primaryText={day.summary}
	                  				secondaryText={day.details}
	                  				leftAvatar={
							        	<Avatar
							            	color={day.isWeekend ? pinkA200 : lightBlack} backgroundColor={transparent}
							            	style={{left: 8}}
							          	>
								            <div style={{textAlign:'center'}}>
								            	<div>{day.label}</div>
								            	<small style={{fontSize:14}}>{day.weekLabel}</small>
								            </div>
							          	</Avatar>
							        }
	                  				nestedItems={
										day.data.map(event =>
												<ListItem key={event.id}
													primaryText={
														<span><span style={event.sleepType === 'dusk' ? {color:lightBlack} : {}}>{event.sleepTime.format('HH:mm')}</span>&nbsp;-&nbsp;<span style={event.sleepType === 'dawn' ? {color:lightBlack} : {}}>{event.endTime.format('HH:mm')}</span></span>
													}
													secondaryText={event.duration}
													leftIcon={event.sleepType === 'day' ? <IconDay/> : <IconNight/> }
													rightIconButton={
														<IconMenu iconButtonElement={iconButtonElement}>
												    		<MenuItem onTouchTap={e => this.handleOpen('edit', event.id)}>Edit</MenuItem>
												    		<MenuItem onTouchTap={e => this.handleOpen('delete', event.id)}>Delete</MenuItem>
												  		</IconMenu>
													} />
	                  					)
	                  				}/>
	                  			<Divider inset={true} />
	                  		</div>	
                  		)		
                  	}
				</List>
			)	
		}

		{dialog}
		
		</div>
		)
	}
}

class EventMap {
	constructor() {
		this.dayKeys = new Map(); 
    	this.dayMap = new Map();
    	this.keyIndex = 1;
  	}

  	put(moment, data) {
  		var keyId = moment.format('DDD YYYY');
		var dayKey = this.dayKeys.get(keyId);
		if(!dayKey) {
			console.log('no key found', keyId, this.dayKeys.size);
			dayKey = moment.clone().startOf('day');
			this.dayKeys.set(keyId, dayKey);
		}
		
		var value = this.dayMap.get(dayKey) || [];
		value.push(data);
		this.dayMap.set(dayKey, value);
  	}

	getSleepType(startMoment, endMoment, dayMoment) {
		console.log('sleepType', dayMoment.date(), startMoment.date(), endMoment.date());
		if(dayMoment.date() !== startMoment.date()) {
			return 'dusk';
		} else if (dayMoment.date() !== endMoment.date()) {
			return 'dawn';
		} else {
			var hour = parseInt(startMoment.format('H'));
			return (hour > 18 || hour < 6) ? 'night' : 'day';	
		}
	}

	formatDuration(ms, format) {
		var hours = String(Math.floor(ms / 3600000));
		var minutes = String(Math.floor((ms % 3600000) / MILLISEC_PER_MINUTE));

		if(hours === "1") {
			hours += format === 'short' ? 'h' : " hour";
		} else {
			hours += format === 'short' ? 'h' : " hours";
		}

		if(minutes === "1") {
			minutes += format === 'short' ? 'm' : " minute";
		} else {
			minutes += format === 'short' ? 'm' : " minutes";
		}

		var concatString = format === 'short' ? ' ' : " and ";

		return hours + concatString + minutes;
	}

	sumDaySleep(dateMoment, events) {
		var sumSleep = 0;

		events.forEach(e => {
			if(e.sleepTime.date() === e.endTime.date()) {
				sumSleep += e.endTime.diff(e.sleepTime);
			} else if (e.sleepTime.date() == dateMoment.date()) {
				sumSleep += e.sleepTime.clone().endOf('day').diff(e.sleepTime);
			} else {
				sumSleep += e.endTime.diff(e.endTime.clone().startOf('day'));
			}
		});

		return "Slept " + this.formatDuration(sumSleep); 
	}

	sumDetails(dateMoment, events) {
		var sumActiveTime = MILLISEC_PER_DAY;
		var sumPreSleep = 0;

		events.forEach(e => {
			if(e.sleepTime.date() === e.endTime.date()) {
				sumActiveTime -= e.endTime.diff(e.sleepTime);
			} else if (e.sleepTime.date() == dateMoment.date()) {
				sumActiveTime -= e.sleepTime.clone().endOf('day').diff(e.sleepTime);
			} else {
				sumActiveTime -= e.endTime.diff(e.endTime.clone().startOf('day'));
			}
		});

		events.forEach(e => {
			if(e.sleepTime.date() === e.endTime.date()) {
				sumPreSleep += e.sleepTime.diff(e.startTime);
			} else if (e.sleepTime.date() == dateMoment.date()) {
				sumPreSleep += e.sleepTime.diff(e.startTime);
			}
		});

		return "Active: " + this.formatDuration(sumActiveTime, 'short') + ", Pre-sleep: " + this.formatDuration(sumPreSleep, 'short');
	}

	daySort(a, b) {
  		return b.label.localeCompare(a.label);
  	}

  	eventSort(a, b) {
  		return b.startTime.diff(a.startTime);
  	}

  	toNestedArray() {

  		return [...this.dayMap].map(([dayMoment, events]) => ({
				key: dayMoment.unix(),
	  			label: dayMoment.format('D'),
	  			isWeekend: parseInt(dayMoment.format('d')) >= 5,
	  			week: 'Week ' + dayMoment.format('W') + ' ' + dayMoment.format('MMM YYYY'),
	  			weekLabel: dayMoment.format('ddd'),  
	  			summary: this.sumDaySleep(dayMoment, events),
	  			details: this.sumDetails(dayMoment, events), 
	  			data: events.map(event => {
	  				return Object.assign({
	  					duration: this.formatDuration(event.endTime.diff(event.sleepTime)),
	  					sleepType: this.getSleepType(event.sleepTime, event.endTime, dayMoment)
	  				}, event);
	  			}).sort(this.eventSort)
	  		})).sort(this.daySort).group(day => day.week);
  	}
}

function select(state) {
	var eventMap = new EventMap();

	if(Array.isArray(state.sleepEvents) && state.sleepEvents.length > 0) {

		state.sleepEvents.forEach(e => {
			eventMap.put(e.data.sleepTime, e.data);

			if(e.data.sleepTime.get('date') !== e.data.endTime.get('date')) {
				eventMap.put(e.data.endTime, e.data);
			}
		});	

	}

	return {
		events: state.sleepEvents || [],
		eventMap: eventMap.toNestedArray()
	}
}

export default connect(select)(ListEvents)