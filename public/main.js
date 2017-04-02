import 'whatwg-fetch'

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'

import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import App from './App.jsx'
import rootReducer from './reducers/reducers'
import { addSleepEvent } from './actions/actions'
import Moment from 'moment'

Object.defineProperty(Array.prototype, 'group', {
  enumerable: false,
  value: function (key) {
    var map = {};
    this.map(e => ({k: key(e), d: e})).forEach(e => {
      map[e.k] = map[e.k] || [];
      map[e.k].push(e.d);
    });
    return Object.keys(map).map(k => ({key: k, data: map[k]}));
  }
});

injectTapEventPlugin();

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware // lets us dispatch() functions
  )
)

const history = createBrowserHistory()

var currentMoment = Moment();
var startTime, sleepTime, endTime;

/*for(let i = 0; i < 10; i++) {

	for(let j = 0; j < 3; j++) {

		currentMoment.startOf('day');

		switch(j) {
			case 0:
				currentMoment.add(Math.round(Math.random()*120) + 1200, 'minutes');
				startTime = Moment(currentMoment.toDate());
				sleepTime = Moment(currentMoment.toDate());
				endTime = Moment(currentMoment.toDate());
				sleepTime.add(Math.round(Math.random()*20), 'minutes');
				endTime.add(Math.round(Math.random()*120) + 480 , 'minutes');
				break;
			case 1:
				currentMoment.add(Math.round(Math.random()*120) + 860, 'minutes');
				startTime = Moment(currentMoment.toDate());
				sleepTime = Moment(currentMoment.toDate());
				endTime = Moment(currentMoment.toDate());
				sleepTime.add(Math.round(Math.random()*20), 'minutes');
				endTime.add(Math.round(Math.random()*60) + 60 , 'minutes');
				break;
			case 2:
				currentMoment.add(Math.round(Math.random()*120) + 600, 'minutes');
				startTime = Moment(currentMoment.toDate());
				sleepTime = Moment(currentMoment.toDate());
				endTime = Moment(currentMoment.toDate());
				sleepTime.add(Math.round(Math.random()*20), 'minutes');
				endTime.add(Math.round(Math.random()*60) + 60 , 'minutes');
				break;
		}

	   store.dispatch(addSleepEvent({
	     startTime: startTime,
	     sleepTime: sleepTime,
	     endTime: endTime,
	  }));

	   //currentMoment.add(Math.round(Math.random()*3+3), 'hours'); 
	}

	currentMoment.add(1, 'days');  
}*/

ReactDOM.render((
   <Provider store = {store}>
	   <MuiThemeProvider>
			<Router history={history}>
				<Route path="/" component={App} />
			</Router>
	   </MuiThemeProvider>
   </Provider>
), document.getElementById('app'))