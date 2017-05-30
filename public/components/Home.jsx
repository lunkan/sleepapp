import React, { Component, PropTypes } from 'react';
import MediaQuery from 'react-responsive';

import Log from './List.jsx';
import Graph from './Overview.jsx';

export default class Home extends Component {

	render() {

		return (
			<div>
				<MediaQuery query='(min-device-width: 800px)'>
					<Log/>
				</MediaQuery>
				<MediaQuery query='(max-device-width: 800px)'>
					<MediaQuery orientation='portrait'>
						<Log/>
			        </MediaQuery>
			        <MediaQuery orientation='landscape'>
			        	<Graph chromless="true"/>
			        </MediaQuery>
				</MediaQuery>
			</div>
		);
	}
}