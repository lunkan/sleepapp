import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import TextField from 'material-ui/TextField';

import { saveSleepForm, initSleepForm, putSleepFormData } from '../actions/actions';

class ModalSleepEvent extends Component {
	constructor() {
		super();

		this.handleUpdate = this.handleUpdate.bind(this);
		this.handleConfirm = this.handleConfirm.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
	}
	
	componentWillMount() {
		const {match, sleepEvents, dispatch} = this.props;
		let sleepEvent = sleepEvents.find(sleepEvent => sleepEvent.id === match.params.id) || {};
		dispatch(initSleepForm(sleepEvent));
	}

	handleUpdate(data) {
		const { dispatch } = this.props;
		dispatch(putSleepForm(data));
	}

	handleConfirm() {
		const { history, sleepForm } = this.props;
		dispatch(saveSleepForm(sleepForm));
		history.goBack();
	}

	handleCancel() {
		const { history } = this.props;
		history.goBack();
	}

	modalActions() {
		return [
			<FlatButton label="Cancel" primary={true} onTouchTap={e => this.handleCancel()} />,
			<FlatButton label="Submit" primary={true} onTouchTap={e => this.handleConfirm()} />,
		];
	}

	render() {
		const { match, sleepForm } = this.props;
		const { date, sleepTime, endTime, preSleepDuration } = sleepForm;
		const title = match.params.id ? 'Edit sleep event' : 'Add sleep event';

		return 	(<Dialog title={title} actions={this.modalActions()} modal={true} open={true}>
			<div>
            	<DatePicker onChange={(e, value) => this.handleUpdate({date: value})} floatingLabelText="Date" value={date} autoOk={true} />
            	<TimePicker onChange={(e, value) => this.handleUpdate({sleepTime: value})} format="24hr" floatingLabelText="Sleep time" value={sleepTime} autoOk={true} /> 
            	<TimePicker onChange={(e, value) => this.handleUpdate({endTime: value})} format="24hr" floatingLabelText="End time" value={endTime} autoOk={true} />
            	<TextField onChange={(e, value) => this.handleUpdate({preSleepDuration: value})} floatingLabelText="Duration of pre-sleep (minutes)" value={preSleepDuration} />
         	</div>
         </Dialog>);
	}
}

function select(state) {
	return {
		sleepEvents: state.sleepEvents,
		sleepForm: state.sleepForm || {}
	}
}

export default connect(select)(ModalSleepEvent)