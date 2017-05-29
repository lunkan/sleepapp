import React, { Component } from 'react';
import { connect } from 'react-redux';

import AppBar from 'material-ui/AppBar';

import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';

import IconUser from 'material-ui/svg-icons/action/account-circle';
import IconChildCare from 'material-ui/svg-icons/places/child-care';

import { logout } from '../actions/actions';

class UserMenu extends React.Component {

	constructor() {
      super();

      this.state = {
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

	render() {
		const { session } = this.props;

		if(!session.isAuthenticated) {
			return null;
		}

   		return (
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
		        	onTouchTap={this.handleOpenUserMenu} label={session.username} />
	  		</div>
		);
	}
}

const UserMenuComponent = connect(state => ({ session: state.session }))(UserMenu);

export default class TopMenuBar extends React.Component {

	constructor() {
      super();
  	}

	render() {
		const { style } = this.props;

	  	return (
      		<AppBar style={style} title={'Sleep app'}
		    	iconElementLeft={<IconButton><IconChildCare/></IconButton>}
		    	iconElementRight={<UserMenuComponent/>} />
		);
	}
}