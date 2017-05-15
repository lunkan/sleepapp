import React, { Component } from 'react';
import { connect } from 'react-redux';

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import { createUser } from '../actions/actions';

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
			    	<TextField onChange={this.handleUsernameChange} value={this.state.username} floatingLabelText="Username"/><br/>
			    	<TextField onChange={this.handlePasswordChange} value={this.state.password} floatingLabelText="Password" type="password"/><br/>
			    	<TextField onChange={this.handleRePasswordChange} value={this.state.repassword} floatingLabelText="Retype password" type="password"/><br/>
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

export default connect()(CreateUserForm);