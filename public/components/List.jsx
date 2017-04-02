import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Moment from 'moment'

import { grey500, grey400, darkBlack, lightBlack } from 'material-ui/styles/colors';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
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

import { addSleepEvent, updateSleepEvent, deleteSleepEvent } from '../actions/actions'

import AddSleepEvent from './AddSleepEvent.jsx'


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
	const { dispatch, events } = this.props;
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

	let groupedEvents = events.group(event => event.formattedData.date)
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
		<IconMenu
          iconButtonElement={<IconButton><IconFilter /></IconButton>}
          onChange={this.handleChangeMultiple}
          value="filter"
          multiple={true}
        >
          <MenuItem value="1" primaryText="7 days" />
          <MenuItem value="2" primaryText="30 days" />
          <MenuItem value="3" primaryText="All" />
        </IconMenu>
		</ToolbarGroup>
		<ToolbarGroup>
		<FloatingActionButton mini={true}>
		<IconAdd onTouchTap={e => this.handleOpen('add')} />
		</FloatingActionButton>

		</ToolbarGroup>
		</Toolbar>
		{groupedEvents.map(eventGroup =>
			<List key={eventGroup.key}>
			<Subheader style={{fontFamily:"Roboto"}}>{eventGroup.key}</Subheader>
			{eventGroup.data.map(event =>
				<div key={event.id}>
				<ListItem 
				primaryText={event.formattedData.sleepTime + " (" + event.formattedData.sleepDuration + ")"}
				secondaryText={event.formattedData.preSleepTime + " (" + event.formattedData.preSleepDuration + ")"}
				leftIcon={event.isNightSleep ? <IconNight/> : <IconDay/> }
				rightIconButton={
					<IconMenu iconButtonElement={iconButtonElement}>
			    		<MenuItem onTouchTap={e => this.handleOpen('edit', event.id)}>Edit</MenuItem>
			    		<MenuItem onTouchTap={e => this.handleOpen('delete', event.id)}>Delete</MenuItem>
			  		</IconMenu>
				} />
				<Divider inset={true}/>
				</div>
			)}
			
			</List>
		)}

		{dialog}
		

		</div>
		)
}
}

function select(state) {
	return {
		events: state.sleepEvents || []
	}
}

export default connect(select)(ListEvents)