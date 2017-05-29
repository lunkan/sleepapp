import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import IconFileDownload from 'material-ui/svg-icons/file/file-download';
import IconSettings from 'material-ui/svg-icons/action/settings';

import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';

import { addSleepEvent } from '../actions/actions';
import { MS_PER_HOUR } from '../helpers/time-formats.js';
import PageHeader from './PageHeader.jsx';

class Config extends Component {
	constructor() {
		super();

		this.state = {}

		this.handleExport = this.handleExport.bind(this);
		this.handleImport = this.handleImport.bind(this);
		this.handleFileUpload = this.handleFileUpload.bind(this);
	}

	handleExport() {
		const { sleepEvents } = this.props;

		var exportData = sleepEvents.map(e => ({
			id: e.id,
			preSleep: e.preSleep.format(),
			sleep: e.sleep.format(),
			wakeUp: e.wakeup.format(),
		}));

		var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData));
		var anchorElem = this.refs.exportAnchorElem;
		anchorElem.setAttribute('href', dataStr);
		anchorElem.setAttribute('download', 'sleeplog.json');
		anchorElem.click();
	}

	handleImport() {
		this.refs.importAnchorElem.click();
	}

	handleFileUpload({files}) {
		const { dispatch } = this.props;
		const file = this.refs.importAnchorElem.files[0];
		
		var reader = new FileReader();
		reader.onload = function(e) {
			const models = JSON.parse(e.target.result);
			dispatch(addSleepEvent(models));
  		}

		reader.readAsText(file);
	}

	render() {
		const { sleepEvents, config } = this.props;

		const sizeReportText = sleepEvents.length + ' Items';
		const dayBeginsAtHourLabel = `Current value ${config.dayBeginsAtHour}`;
		const durationThresholdLabel = `Current value ${config.durationThreshold/MS_PER_HOUR}`;
		const durationTrendThresholdLabel = `Current value ${config.durationTrendThreshold}`;
		const durationTrendTensionLabel = `Current value ${config.durationTrendTension}`;
		const durationTrendIntervalLabel = `Current value ${config.durationTrendInterval}`;
   		const durationTrendIntervalMaxLabel = `Current value ${config.durationTrendIntervalMax}`;

		return (
			<div>
				<PageHeader pageTitle="Config"/>
				<List>
			        <Subheader style={{fontFamily:"Roboto"}}>Export&#47;Import</Subheader>
			        <ListItem onTouchTap={e => this.handleExport()} leftIcon={<IconFileDownload />} primaryText="Export sleep log" secondaryText={sizeReportText} />
			        <ListItem onTouchTap={e => this.handleImport()} leftIcon={<IconFileDownload />} primaryText="Import sleep log" secondaryText="JSON files only" />
			    </List>
			    <Divider/>
			    <List>
			        <Subheader style={{fontFamily:"Roboto"}}>Time settings</Subheader>
			        <ListItem leftIcon={<IconSettings />} primaryText="Day begins at (time)" secondaryText={dayBeginsAtHourLabel} />
			    </List>
			    <Divider/>
			    <List>
			        <Subheader style={{fontFamily:"Roboto"}}>Sleep duration settings</Subheader>
			        <ListItem leftIcon={<IconSettings />} primaryText="Min threshold (hours)" secondaryText={durationThresholdLabel} />
			        <ListItem leftIcon={<IconSettings />} primaryText="Trend accepted offset (%)" secondaryText={durationTrendThresholdLabel} />
			        <ListItem leftIcon={<IconSettings />} primaryText="Trend tension (%)" secondaryText={durationTrendTensionLabel} />
			        <ListItem leftIcon={<IconSettings />} primaryText="Trend points to display" secondaryText={durationTrendIntervalLabel} />
			        <ListItem leftIcon={<IconSettings />} primaryText="Trend points max" secondaryText={durationTrendIntervalMaxLabel} />
			    </List>
			    <a ref="exportAnchorElem" style={{display:"none"}}></a>
			    <input onChange={this.handleFileUpload} type="file" ref="importAnchorElem" style={{display:"none"}}/>
			</div>);
	}
}

function select(state) {
	return {
		sleepEvents: state.sleepEvents,
		config: state.config
	}
}

export default connect(select)(Config)