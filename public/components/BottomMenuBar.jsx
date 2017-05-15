import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';

import IconTimeline from 'material-ui/svg-icons/action/timeline';
import IconViewList from 'material-ui/svg-icons/action/view-list';
import IconSettings from 'material-ui/svg-icons/action/settings';


class BottomMenuBar extends React.Component {

	render() {
   		const { user} = this.props;

   		if(!user.isAuthenticated) {
			return null;
		}

      	return (
      		<Paper zDepth={1}>
		  		<BottomNavigation>
	        		<BottomNavigationItem
	            		label={<Link to="/graph">Graph</Link>}
	            		icon={<Link to="/graph"><IconTimeline /></Link>}/>
	          		<BottomNavigationItem
	            		label={<Link to="/list">Log</Link>}
	            		icon={<Link to="/list"><IconViewList /></Link>}/>
	        		<BottomNavigationItem
	            		label={<Link to="/config">Config</Link>}
	            		icon={<Link to="/config"><IconSettings /></Link>}/>
	        	</BottomNavigation>
	        </Paper>
      	)
	}
}

function select(state) {
   return {
      user: state.user
   }
}

export default connect(select)(BottomMenuBar);
