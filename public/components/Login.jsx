import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import LoginForm from './LoginForm.jsx';
import CreateUserForm from './CreateUserForm.jsx';

class Login extends Component {
	render() {
		const { from } = this.props.location.state || { from: { pathname: '/' } }
		const { session } = this.props;

		if (session.isAuthenticated) {
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
		session: state.session
	}
}

export default connect(select)(Login)