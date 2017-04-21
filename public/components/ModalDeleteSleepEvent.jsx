import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import { deleteSleepEvent } from '../actions/actions';

class ModalDeleteSleepEvent extends Component {
	constructor() {
		super();

		this.handleConfirm = this.handleConfirm.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
	}

	handleConfirm() {
		const {dispatch, match, history} = this.props;
		dispatch(deleteSleepEvent(match.params.id));
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
		const { match, events } = this.props;
		const selectedEvent = events.find(event => event.id === match.params.id);
		const DELETE_EVENT_TEXT = 'Delete sleep event';
		const DELETE_EVENT_MESSAGE = 'Are you sure you want to delete event?';

		return 	(<Dialog title={DELETE_EVENT_TEXT} actions={this.modalActions()} modal={true} open={true}>
			<h3>{DELETE_EVENT_MESSAGE}</h3>
			<p>{selectedEvent.sleepTime.format('dddd, MMMM Do HH:mm')} - {selectedEvent.endTime.format('dddd, MMMM Do HH:mm')}</p>
		</Dialog>);
	}
}

function select(state) {
	return {
		events: state.sleepEvents
	}
}

export default connect(select)(ModalDeleteSleepEvent)