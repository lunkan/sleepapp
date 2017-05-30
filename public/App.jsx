import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Link, Redirect, withRouter } from 'react-router-dom';

import { fetchSession } from './actions/actions';

import TopMenuBar from './components/TopMenuBar.jsx';
import BottomMenuBar from './components/BottomMenuBar.jsx';

import Home from './components/Home.jsx';
import Log from './components/List.jsx';
import Login from './components/Login.jsx';
import Graph from './components/Overview.jsx';
import Config from './components/Config.jsx';

import ModalDeleteSleepEvent from './components/ModalDeleteSleepEvent.jsx';
import ModalSleepEvent from './components/ModalSleepEvent.jsx';

const styleMainContainer = {
	paddingTop: 64,
	paddingBottom: 56
};

const styleTopMenuBar = {
	position: 'fixed',
	left: 0,
	top: 0,
	right: 0
}

const styleBottomMenuBar = {
	zIndex: 1,
	position: 'fixed',
	left: 0,
	bottom: 0,
	right: 0
}

class App extends React.Component {

	componentWillMount() {
    	const {dispatch} = this.props;
		dispatch(fetchSession());
  	}

  	componentWillUpdate(nextProps) {
  		const { location } = this.props;
    
    	if (nextProps.history.action !== 'POP' && (!location.state || !location.state.modal)) {
      		this.previousLocation = this.props.location
    	}
	}

	render() {
   		const { location, session } = this.props
    	const isModal = !!(
      		location.state &&
      		location.state.modal &&
      		this.previousLocation !== location // not initial render
    	);	

		const PrivateRoute = ({ component: Component }) => (
			<Route render={props =>
				(session.isAuthenticated ? (
		    		<Component {...props}/>
		    	) : (
		      		<Redirect to={{
		        		pathname: '/login',
		        		state: { from: props.location }
		      		}}/>
		    	)
		  	)}/>
		);

    	const ModalRoutes = () => {
    		return (<div>
				<Route path='/add' component={ModalSleepEvent} />
				<Route path='/edit/:id' component={ModalSleepEvent} />
				<Route path='/delete/:id' component={ModalDeleteSleepEvent} />
			</div>);
    	}

      	return (
      		<div>
		    	<TopMenuBar style={styleTopMenuBar} />
		    	<div style={styleMainContainer}>
		    		<Switch location={isModal ? this.previousLocation : location}>
		    			<Route exact path="/" component={session.isAuthenticated ? Home : Login}/>
						<Route path='/login' component={Login} />
				  		<PrivateRoute path="/graph" component={Graph}/>
				  		<PrivateRoute path="/list" component={Log}/>
				  		<PrivateRoute path="/config" component={Config}/>
				  	</Switch>
				  	{isModal ? <ModalRoutes/> : null}
			  	</div>
			  	<BottomMenuBar style={styleBottomMenuBar} />
		    </div>
      	)
	}
}

function select(state) {
   return {
      session: state.session
   }
}

export default connect(select)(App);
