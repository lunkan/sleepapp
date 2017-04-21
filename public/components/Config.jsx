import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import IconFileDownload from 'material-ui/svg-icons/file/file-download';

import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';

import PageHeader from './PageHeader.jsx';

class Config extends Component {
	constructor() {
		super();

		this.state = {}

		this.handleExport = this.handleExport.bind(this);
	}

	handleExport() {
		const { sleepEvents } = this.props;

		var exportData = sleepEvents.map(e => ({
			id: e.id,
			startTime: e.startTime.format('YYYY-MM-DD HH:mm'),
			sleepTime: e.sleepTime.format('YYYY-MM-DD HH:mm'),
			endTime: e.endTime.format('YYYY-MM-DD HH:mm'),
		}));

		var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData));
		var anchorElem = this.refs.exportAnchorElem;
		anchorElem.setAttribute('href', dataStr);
		anchorElem.setAttribute('download', 'sleeplog.json');
		anchorElem.click();
	}

	render() {
		const { sleepEvents } = this.props;
		const sizeReportText = sleepEvents.length + ' Items';

		return (
			<div>
				<PageHeader pageTitle="Config"/>
				<List>
			        <Subheader style={{fontFamily:"Roboto"}}>Export&#47;Import</Subheader>
			        <ListItem onTouchTap={e => this.handleExport()} leftIcon={<IconFileDownload />} primaryText="Export sleep log" secondaryText={sizeReportText} />
			    </List>
			    <a ref="exportAnchorElem" style={{display:"none"}}></a>
			</div>);
	}
}

function select(state) {
	return {
		sleepEvents: state.sleepEvents
	}
}

export default connect(select)(Config)