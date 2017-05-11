import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import Moment from 'frozen-moment';

import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';

import IconAdd from 'material-ui/svg-icons/content/add';
import IconFilter from 'material-ui/svg-icons/content/filter-list';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DatePicker from 'material-ui/DatePicker';

import { setFilter } from '../actions/actions';

class PageHeader extends Component {

	constructor() {
		super();

		this.state = {
			openMenu: false,
			openCustomFilterDialog: false,
			customFromDate: null,
			customToDate: null
		};

		this.handleOpenFilterMenu = this.handleOpenFilterMenu.bind(this);
		this.handleFilterChange = this.handleFilterChange.bind(this);

		this.handleCustomFilterFromChange = this.handleCustomFilterFromChange.bind(this);
		this.handleCustomFilterToChange = this.handleCustomFilterToChange.bind(this);

		this.handleConfirm = this.handleConfirm.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
	}

	handleOpenFilterMenu() {
    	this.setState({openMenu: true});
  	}

  	handleFilterChange(event, value) {
  		var {dispatch} = this.props;

  		this.setState({openMenu: false});

    	if(value === 'custom') {
			this.setState({openCustomFilterDialog: true});
    	} else {
    		dispatch(setFilter(value));
    	}
    }

	handleConfirm() {
		const { history, dispatch } = this.props;
		const { customFromDate, customToDate } = this.state;

		dispatch(
			setFilter(
				'custom',
				Moment(customFromDate || 0 ),
				Moment(customToDate || new Date())
			)
		);

		this.setState({openCustomFilterDialog: false});
	}

	handleCancel() {
		this.setState({openCustomFilterDialog: false});
	}

	handleCustomFilterFromChange(e, value) {
		this.setState({customFromDate: value});
	}

	handleCustomFilterToChange(e, value) {
		this.setState({customToDate: value});
	}

	render() {
		const { pageTitle, eventFilter } = this.props;
		const { openCustomFilterDialog, customFromDate, customToDate } = this.state;

		const filterLabel = eventFilter.type === 'custom' ? `${eventFilter.from.format('MMM D YYYY')} - ${eventFilter.to.format('MMM D YYYY')}` : eventFilter.type;
		const customFilterDialogTitle = 'Custom filter';

		const modalActions = [
			<FlatButton label="Cancel" primary={true} onTouchTap={e => this.handleCancel()} />,
			<FlatButton label="Submit" primary={true} onTouchTap={e => this.handleConfirm()} />,
		];

		return (
			<div>
				<Toolbar>
					<ToolbarGroup>
	          			<ToolbarTitle text={pageTitle} />
					</ToolbarGroup>
					<ToolbarGroup>
						<IconMenu iconButtonElement={<IconButton></IconButton>} open={this.state.openMenu} onChange={this.handleFilterChange}>
          					<MenuItem value={'week'} primaryText="Last week" />
         					<MenuItem value={'month'} primaryText="Last month" />
          					<MenuItem value={'year'} primaryText="Last year" />
          					<MenuItem value={'custom'} primaryText="Custom" />
          					<MenuItem value={'all'} primaryText="All" />
			        	</IconMenu>
			        	<RaisedButton
			        		labelPosition="before"
			        		icon={<IconFilter/>}
			        		onTouchTap={this.handleOpenFilterMenu}
			        		label={filterLabel} />
						<Link to={{pathname: '/add', state: { modal: true }}}>
							<RaisedButton
						      label="New sleep event"
						      labelPosition="before"
						      primary={true}
						      icon={<IconAdd />}/>
						</Link>
					</ToolbarGroup>
				</Toolbar>

				<Dialog
					title={customFilterDialogTitle}
					actions={modalActions}
					modal={true}
					open={openCustomFilterDialog}
					onRequestClose={this.handleCancel}>
					<div>
		            	<DatePicker onChange={this.handleCustomFilterFromChange} floatingLabelText="From" value={customFromDate} autoOk={true} />
		            	<DatePicker onChange={this.handleCustomFilterToChange} floatingLabelText="To" value={customToDate} autoOk={true} />
		         	</div>
		         </Dialog>

			</div>
		)	
	}
}

function select(state) {
	return {
		eventFilter: state.config.eventFilter
	}
}

export default connect(select)(PageHeader)