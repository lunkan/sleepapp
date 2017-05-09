import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';

import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import IconAdd from 'material-ui/svg-icons/content/add';
import RaisedButton from 'material-ui/RaisedButton';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';

import { setFilter } from '../actions/actions';

class PageHeader extends Component {

	constructor() {
		super();

		this.state = {
			openMenu: false
		};

		this.handleOpenFilterMenu = this.handleOpenFilterMenu.bind(this);
		this.handleFilterChange = this.handleFilterChange.bind(this);
	}

	handleOpenFilterMenu() {
    	this.setState({
      		openMenu: true,
    	});
  	}

  	handleFilterChange(event, value) {
  		var {dispatch} = this.props;

  		this.setState({
      		openMenu: false,
    	});

    	dispatch(setFilter(value));
    }

	render() {
		const { pageTitle, eventFilter } = this.props;

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
			        	<RaisedButton onTouchTap={this.handleOpenFilterMenu} label={eventFilter.type} />
						<Link to={{pathname: '/add', state: { modal: true }}}>
							<RaisedButton
						      label="New sleep event"
						      labelPosition="before"
						      primary={true}
						      icon={<IconAdd />}/>
						</Link>
					</ToolbarGroup>
				</Toolbar>
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