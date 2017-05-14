import React, { Component, PropTypes } from 'react'
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import { login, createUser } from '../actions/actions';

class Login extends Component {
	constructor() {
		super();

		this.state = {}

		this.handleOnLogin = this.handleOnLogin.bind(this);
		this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);

		this.handleNewUsernameChange = this.handleNewUsernameChange.bind(this);
		this.handleNewPasswordChange = this.handleNewPasswordChange.bind(this);
		this.handleNewRePasswordChange = this.handleNewRePasswordChange.bind(this);
		this.handleSubmitNewUser = this.handleSubmitNewUser.bind(this);
	}

	handleOnLogin() {
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

	handleNewUsernameChange(e, value) {
		this.setState({newUsername: value});
	}

	handleNewPasswordChange(e, value) {
		this.setState({newPassword: value});
	}

	handleNewRePasswordChange(e, value) {
		this.setState({newRePassword: value});
	}

	handleSubmitNewUser() {
		const { newUsername, newPassword, newRePassword } = this.state;
		const { dispatch } = this.props;
		dispatch(createUser(newUsername, newPassword, newRePassword));
	}

	render() {
		const { from } = this.props.location.state || { from: { pathname: '/' } }
		const { username, password, newUsername, newPassword, newRePassword } = this.state;
		const { user } = this.props;

		console.log('Login:isAuthenticated', user.isAuthenticated, from);

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

		if (user.isAuthenticated) {
			return (
        		<Redirect to={from}/>
      		)
    	}

		return (
			<div>
				<Card style={cardStyle}>
				    <CardText>
				    	<TextField onChange={this.handleUsernameChange} value={username} floatingLabelText="Username"/><br/>
				    	<TextField onChange={this.handlePasswordChange} value={password} floatingLabelText="Password" type="password"/><br/>
				    	<div style={buttonGroupStyle}>
				    		<RaisedButton
				    			label="Login"
				    			onTouchTap={this.handleOnLogin}
				    			primary={true}
				    			style={buttonStyle}/>
				    	</div>
				    </CardText>
				</Card>
				<Card style={cardStyle}>
				    <CardHeader title="New to sleep app?" subtitle="Create new account"/>
				    <CardText>
				    	<TextField onChange={this.handleNewUsernameChange} value={newUsername} floatingLabelText="Username"/><br/>
				    	<TextField onChange={this.handleNewPasswordChange} value={newPassword} floatingLabelText="Password" type="password"/><br/>
				    	<TextField onChange={this.handleNewRePasswordChange} value={newRePassword} floatingLabelText="Retype password" type="password"/><br/>
				    	<div style={buttonGroupStyle}>
				    		<RaisedButton onTouchTap={e => this.handleSubmitNewUser()} label="Continue" primary={true} style={buttonStyle}/>
				    	</div>
				    </CardText>
				</Card>					
			</div>);
	}
}

function select(state) {
	return {
		user: state.user
	}
}

export default connect(select)(Login)