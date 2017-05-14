import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Switch, Link, Redirect, withRouter } from 'react-router-dom'

import AppBar from 'material-ui/AppBar';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';

import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';

import IconUser from 'material-ui/svg-icons/action/account-circle';

import IconChildCare from 'material-ui/svg-icons/places/child-care';
import IconAlarmAdd from 'material-ui/svg-icons/action/alarm-add';
import IconTimeline from 'material-ui/svg-icons/action/timeline';
import IconViewList from 'material-ui/svg-icons/action/view-list';
import IconSettings from 'material-ui/svg-icons/action/settings';

import { fetchUser, logout } from './actions/actions'

import Log from './components/List.jsx';
import Login from './components/Login.jsx';
import Graph from './components/Overview.jsx';
import Config from './components/Config.jsx';

import ModalDeleteSleepEvent from './components/ModalDeleteSleepEvent.jsx';
import ModalSleepEvent from './components/ModalSleepEvent.jsx';

const routes = ['/graph', '/list', '/config']

class App extends React.Component {

	constructor() {
      super();

      this.state = {
         selectedIndex: 0,
         openUserMenu: false
      }

      this.handleOnUserMenuRequestChange = this.handleOnUserMenuRequestChange.bind(this);
      this.handleOpenUserMenu = this.handleOpenUserMenu.bind(this);
      this.handleOnLogout = this.handleOnLogout.bind(this);
  	}

	handleOpenUserMenu() {
    	this.setState({openUserMenu: true});
  	}

	handleOnUserMenuRequestChange() {
		this.setState({openUserMenu: false});
    }

	handleOnLogout() {
		const {dispatch} = this.props;
		dispatch(logout());
	}

	componentWillMount() {
    	const {dispatch} = this.props;
		dispatch(fetchUser());
  	}

  	componentWillUpdate(nextProps) {
  		const { location } = this.props;
    
    	if (nextProps.history.action !== 'POP' && (!location.state || !location.state.modal)) {
      		this.previousLocation = this.props.location
    	}
	}

	componentWillReceiveProps(nextProps) {
   		this.setState({
			selectedIndex: Math.max(0, routes.indexOf(nextProps.location.pathname))
		});
	}

   render() {
   		const { location, user } = this.props
    	const isModal = !!(
      		location.state &&
      		location.state.modal &&
      		this.previousLocation !== location // not initial render
    	);	

		const PrivateRoute = ({ component: Component }) => (
			<Route render={props =>
				(user.isAuthenticated ? (
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

		const userMenu = (
			<div>
				<IconMenu
		          iconButtonElement={<IconButton style={{height:42}}></IconButton>}
		          open={this.state.openUserMenu}
		          onRequestChange={this.handleOnUserMenuRequestChange}>
		          	<MenuItem onTouchTap={() => this.handleOnLogout()} primaryText="Logout" />
		          	<MenuItem primaryText="Change password" />
		        </IconMenu>
		        <FlatButton
		        	style={{color:'#fff'}}
		        	icon={<IconUser/>}
		        	onTouchTap={this.handleOpenUserMenu} label={user.username} />
	  		</div>
  		);

  		const bottomNav = (
  			<Paper zDepth={1}>
		  		<BottomNavigation selectedIndex={this.state.selectedIndex}>
	        		<BottomNavigationItem
	            		label="Graph"
	            		icon={<IconTimeline />}
	            		onTouchTap={() => this.selectRoute(0)} />
	          		<BottomNavigationItem
	            		label="Log"
	            		icon={<IconViewList />}
	            		onTouchTap={() => this.selectRoute(1)} />
	        		<BottomNavigationItem
	            		label="Config"
	            		icon={<IconSettings />}
	            		onTouchTap={() => this.selectRoute(2)} />
	        	</BottomNavigation>
	        </Paper>
	    );

		const appStyle = {
	  		height: '100vh',
	  		display: 'flex',
	  		flexDirection: 'column'
	  	};

	  	const headStyle = {
			flexGrow: 0,
	  		flexShrink: 0
	  	}

		const contentStyle = {
	  		flexGrow: 1,
	  		flexShrink: 1,
	  		overflowY: 'scroll'
	  	};

      	return (

		    <div style={appStyle}>
		    	<AppBar style={headStyle} title={'Sleep app'}
		    	iconElementLeft={<IconButton><IconChildCare/></IconButton>}
		    	iconElementRight={user.isAuthenticated ? userMenu : null} />
		    	<div style={contentStyle}>
		    		<Switch location={isModal ? this.previousLocation : location}>
		    			<Route exact path="/" component={user.isAuthenticated ? Graph : Login}/>
						<Route path='/login' component={Login} />
				  		<PrivateRoute path="/graph" component={Graph}/>
				  		<PrivateRoute path="/list" component={Log}/>
				  		<PrivateRoute path="/config" component={Config}/>
				  	</Switch>
				  	{isModal ? <ModalRoutes/> : null}
			  	</div>
			  	{user.isAuthenticated ? bottomNav : null}
		    </div>
      	)
	}

	selectRoute(index) {
   		this.props.history.push(routes[index]);
   	}
}

function select(state) {
   return {
      user: state.user
   }
}

export default connect(select)(App);
