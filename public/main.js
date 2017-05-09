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

Object.defineProperty(Array.prototype, 'last', {
  enumerable: false,
  value: function () {
    return this[this.length - 1];
  }
});

injectTapEventPlugin();

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware
  )
)

const history = createBrowserHistory();

var currentMoment = Moment();
var startTime, sleepTime, endTime;

ReactDOM.render((
   <Provider store = {store}>
	   <MuiThemeProvider>
			<Router history={history}>
				<Route path="/" component={App} />
			</Router>
	   </MuiThemeProvider>
   </Provider>
), document.getElementById('app'))