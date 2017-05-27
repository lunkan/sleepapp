import React, { Component } from 'react';
import { connect } from 'react-redux';

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import { createUser, clearApiMessage } from '../actions/actions';

import MessageBox from './MessageBox.jsx';

class CreateUserForm extends Component {
	constructor() {
		super();

		this.state = {
			username: '',
			password: '',
			repassword: '',
		}

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.handleRePasswordChange = this.handleRePasswordChange.bind(this);
	}

	componentWillUnmount() {
		const { apiMessages, dispatch } = this.props;

		if(apiMessages) {
			dispatch(clearApiMessage('createUser'));
		}
	}

	handleSubmit() {
		const { dispatch } = this.props;
		const { username, password, repassword } = this.state;

		dispatch(createUser(username, password, repassword));
	}

	handleUsernameChange(e, value) {
		this.setState({username: value});
	}

	handlePasswordChange(e, value) {
		this.setState({password: value});
	}

	handleRePasswordChange(e, value) {
		this.setState({repassword: value});
	}

	render() {
		const { apiMessages } = this.props;
		const fieldErrors = apiMessages && apiMessages.fieldErrors ? apiMessages.fieldErrors : {};	

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
				<CardHeader title="New to sleep app?" subtitle="Create new account"/>
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
			    	<TextField
			    		errorText={fieldErrors.repassword}
			    		onChange={this.handleRePasswordChange}
			    		value={this.state.repassword}
			    		floatingLabelText="Retype password"
			    		type="password"/>
			    	<br/>
			    	<div style={buttonGroupStyle}>
			    		<RaisedButton
			    			label="Create user"
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
		apiMessages: apiMessages['createUser']
	}
}

export default connect(select)(CreateUserForm);