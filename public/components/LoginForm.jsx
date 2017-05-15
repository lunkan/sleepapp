import React, { Component } from 'react';
import { connect } from 'react-redux';

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import { login } from '../actions/actions';

class LoginForm extends Component {
	constructor() {
		super();

		this.state = {
			username: '',
			password: '',
		}

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
	}

	handleSubmit() {
		const { dispatch } = this.props;
		const { username, password } = this.state;
		dispatch(login(username, password));
	}

	handleUsernameChange(e, value) {
		this.setState({username: value});
	}

	handlePasswordChange(e, value) {
		this.setState({password: value});
	}

	render() {
		const cardStyle = {
			margin: 24,
			marginLeft: 'auto',
			marginRight: 'auto',
			maxWidth: 450
		};

		const buttonStyle = {
			float: 'right'
		};

		const buttonGroupStyle = {
			overflow: 'hidden',
			marginTop: 24
		};

		return (
			<Card style={cardStyle}>
			    <CardText>
			    	<TextField onChange={this.handleUsernameChange} value={this.state.username} floatingLabelText="Username"/><br/>
			    	<TextField onChange={this.handlePasswordChange} value={this.state.password} floatingLabelText="Password" type="password"/><br/>
			    	<div style={buttonGroupStyle}>
			    		<RaisedButton
			    			label="Login"
			    			onTouchTap={this.handleSubmit}
			    			primary={true}
			    			style={buttonStyle}/>
			    	</div>
			    </CardText>
			</Card>
		);
	}
}

export default connect()(LoginForm);