import React, { Component } from 'react';

import { deepOrange900, pink300, pink200 } from 'material-ui/styles/colors';

const styleMessage = {
	color: pink300
}

//Component
export default class MessageBox extends Component {
	render() {
		const { errors } = this.props;

		if(!Array.isArray(errors) || errors.length === 0) {
			return null;
		}

		return (
			<div>
				{ errors.map((error, index) => <p style={styleMessage} key={index}>{error}</p>)}
			</div>
		);
	}
}