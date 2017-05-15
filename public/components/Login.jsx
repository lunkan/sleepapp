import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import LoginForm from './LoginForm.jsx';
import CreateUserForm from './CreateUserForm.jsx';

class Login extends Component {
	render() {
		const { from } = this.props.location.state || { from: { pathname: '/' } }
		const { user } = this.props;

		if (user.isAuthenticated) {
			return (
        		<Redirect to={from}/>
      		)
    	}

		return (
			<div>
				<LoginForm/>
				<CreateUserForm/>			
			</div>
		);
	}
}

function select(state) {
	return {
		user: state.user
	}
}

export default connect(select)(Login)