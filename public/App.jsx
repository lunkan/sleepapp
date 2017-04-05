import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from 'react-router-dom'

import AppBar from 'material-ui/AppBar';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import IconChildCare from 'material-ui/svg-icons/places/child-care';
import IconAlarmAdd from 'material-ui/svg-icons/action/alarm-add';
import IconTimeline from 'material-ui/svg-icons/action/timeline';
import IconViewList from 'material-ui/svg-icons/action/view-list';

import { fetchSleepEvents } from './actions/actions'

import ListEvents from './components/List.jsx'
import Overview from './components/Overview.jsx'
import Timer from './components/Timer.jsx'

const routes = ['/timer-event', '/graph', '/list']

class App extends React.Component {

	constructor() {
      super();
      
      this.state = {
         selectedIndex: 0
      }
  	}

	componentWillMount() {
    	const {dispatch} = this.props;
    	dispatch(fetchSleepEvents());
  	}

   componentWillReceiveProps(nextProps) {
   		this.setState({
			selectedIndex: Math.max(0, routes.indexOf(nextProps.location.pathname))
		});
	}

   render() {
		var appStyle = {
	  		height: '100vh',
	  		display: 'flex',
	  		flexDirection: 'column'
	  	};

	  	var headStyle = {
			flexGrow: 0,
	  		flexShrink: 0
	  	}

		var contentStyle = {
	  		flexGrow: 1,
	  		flexShrink: 1,
	  		overflowY: 'scroll'
	  	};

      	return (
		    <div style={appStyle}>
		    	<AppBar style={headStyle} title={'Sleep app'}
		    	iconElementLeft={<IconButton><IconChildCare/></IconButton>} />
		    	<div style={contentStyle}>
			      <Route exact path="/" component={Timer}/>
				  <Route path="/timer-event" component={Timer}/>
				  <Route path="/graph" component={Overview}/>
				  <Route path="/list" component={ListEvents}/>
			  	</div>
		      <Paper zDepth={1}>
		        <BottomNavigation selectedIndex={this.state.selectedIndex}>
		        <BottomNavigationItem
		            label="Add event"
		            icon={<IconAlarmAdd />}
		            onTouchTap={() => this.selectRoute(0)} />
		          <BottomNavigationItem
		            label="Graph"
		            icon={<IconTimeline />}
		            onTouchTap={() => this.selectRoute(1)} />
		          <BottomNavigationItem
		            label="Log"
		            icon={<IconViewList />}
		            onTouchTap={() => this.selectRoute(2)} />
		        </BottomNavigation>  
		      </Paper>

		    </div>
      	)
	}

   selectRoute(index) {
   	this.props.history.push(routes[index]);
   }
}

function select(state) {
   return {
      events: state.sleepEvents || []
   }
}

export default connect(select)(App);
