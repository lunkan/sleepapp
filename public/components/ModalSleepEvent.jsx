import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import TextField from 'material-ui/TextField';

import { saveSleepForm } from '../actions/actions';

class ModalSleepEvent extends Component {
	constructor() {
		super();

		this.state = {
			id: null,
			date: new Date(),
			sleepTime: null,
			endTime: null,
			preSleepDuration: 0
		};

		this.handleDateChange = this.handleDateChange.bind(this);
		this.handleSleepTimeChange = this.handleSleepTimeChange.bind(this);
		this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
		this.handlePreSleepDurationChange = this.handlePreSleepDurationChange.bind(this);

		this.handleConfirm = this.handleConfirm.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
	}
	
	componentWillMount() {
		const {match, sleepEvents, dispatch} = this.props;
		const sleepEvent = sleepEvents.find(sleepEvent => sleepEvent.id === match.params.id);

		if(sleepEvent) {
			const {startTime, sleepTime, endTime, id} = sleepEvent;

			this.setState({
				id: id,
				date: sleepTime ? sleepTime.toDate() : new Date(),
				sleepTime: sleepTime ? sleepTime.toDate() : null,
				endTime: endTime ? endTime.toDate() : null,
				preSleepDuration: startTime && sleepTime ? Math.round(sleepTime.diff(startTime)/60000) : 0,
			});
		}
	}

	handleConfirm() {
		const { history, dispatch } = this.props;
		dispatch(saveSleepForm(Object.assign({}, this.state)));
		history.goBack();
	}

	handleCancel() {
		const { history } = this.props;
		history.goBack();
	}

	handleDateChange(e, value) {
		this.setState({date: value});
	}

	handleSleepTimeChange(e, value) {
		this.setState({sleepTime: value});
	}

	handleEndTimeChange(e, value) {
		this.setState({endTime: value});
	}

	handlePreSleepDurationChange(e) {
		this.setState({preSleepDuration: e.target.value});
	}

	modalActions() {
		return [
			<FlatButton label="Cancel" primary={true} onTouchTap={e => this.handleCancel()} />,
			<FlatButton label="Submit" primary={true} onTouchTap={e => this.handleConfirm()} />,
		];
	}

	render() {
		const { match, sleepForm } = this.props;
		const { date, sleepTime, endTime, preSleepDuration } = this.state;

		const title = match.params.id ? 'Edit sleep event' : 'Add sleep event';

		return 	(<Dialog title={title} actions={this.modalActions()} modal={true} open={true}>
			<div>
            	<DatePicker onChange={this.handleDateChange} floatingLabelText="Date" value={date} autoOk={true} />
            	<TimePicker onChange={this.handleSleepTimeChange} format="24hr" floatingLabelText="Sleep time" value={sleepTime} autoOk={true} /> 
            	<TimePicker onChange={this.handleEndTimeChange} format="24hr" floatingLabelText="End time" value={endTime} autoOk={true} />
            	<TextField onChange={this.handlePreSleepDurationChange} floatingLabelText="Duration of pre-sleep (minutes)" value={preSleepDuration} />
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