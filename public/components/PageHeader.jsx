import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';

import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import IconAdd from 'material-ui/svg-icons/content/add';
import RaisedButton from 'material-ui/RaisedButton';

export default class PageHeader extends Component {

	constructor() {
		super();
	}

	render() {
		const { pageTitle } = this.props;

		return (
			<div>
				<Toolbar>
					<ToolbarGroup>
	          			<ToolbarTitle text={pageTitle} />
					</ToolbarGroup>
					<ToolbarGroup>
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