import React, { Component } from 'react';
import { connect } from 'react-redux';

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import { login, clearApiMessage } from '../actions/actions';

import MessageBox from './MessageBox.jsx';

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

	componentWillUnmount() {
		const { apiMessages, dispatch } = this.props;

		if(apiMessages) {
			dispatch(clearApiMessage('login'));
		}
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
		const { apiMessages } = this.props;
		const fieldErrors = apiMessages && apiMessages.fieldErrors ? apiMessages.fieldErrors : {};	

		return (
			<Card style={cardStyle}>
			    <CardText>
			    	{ apiMessages ? <MessageBox errors={apiMessages.errors}/> : null }
			    	<TextField
			    		errorText={fieldErrors.username}
			    		onChange={this.handleUsernameChange}
			    		value={this.state.username}
			    		floatingLabelText="Username"/>
			    	<br/>
			    	<TextField
			    		errorText={fieldErrors.password}
			    		onChange={this.handlePasswordChange}
			    		value={this.state.password}
			    		floatingLabelText="Password"
			    		type="password"/>
			    	<br/>
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

function select(state) {
	const { apiMessages } = state;

	return {
		apiMessages: apiMessages['login']
	}
}

export default connect(select)(LoginForm);