import { combineReducers } from 'redux';
import { SET_API_MESSAGE, CLEAR_API_MESSAGE, RECEIVE_USER, SET_CONFIG, RECEIVE_SLEEP_EVENT, INIT_SLEEP_FORM, PUT_SLEEP_FORM } from '../actions/actions';
import { MS_PER_DAY, MS_PER_HOUR, humanizeDuration } from '../helpers/time-formats.js';

var defaultConfig = {
   eventFilter: {
      type: 'all'
   },
   dayBeginsAtHour: 0,
   durationThreshold: 8 * MS_PER_HOUR,
   durationTrendThreshold: 0.75,
   durationTrendTension: 0.1,
   durationTrendInterval: 10,
   durationTrendIntervalMax: 100
}

function apiMessages(state = {}, action) {
   switch (action.type) {
      case SET_API_MESSAGE:
         var nextState = Object.assign({}, state);
         nextState[action.id] = action.data;
         return nextState;
      case CLEAR_API_MESSAGE:
         var nextState = Object.assign({}, state);
         delete nextState[action.id];
         return nextState;
      default:
         return state;
   }
}

function user(state = {}, action) {
   switch (action.type) {
      case RECEIVE_USER:
         return action.data;
      default:
         return state;
   }
}

function config(state = defaultConfig, action) {
   switch (action.type) {
      case SET_CONFIG:
         var nextState = Object.assign({}, state);
         return Object.assign(nextState, action.data);
      default:
         return state
   }
}

function sleepEvents(state = [], action) {
   switch (action.type) {
      case RECEIVE_SLEEP_EVENT:
         return action.events;

      default:
         return state
   }
}

function sleepForm(state = {}, action) {
   switch (action.type) {
      case INIT_SLEEP_FORM:
         return action.data;

      case PUT_SLEEP_FORM:
         var nextState = Object.assign({}, state);
         return Object.assign(nextState, action.data);

      default:
         return state
   }
}

const sleepApp = combineReducers({
   apiMessages,
   sleepEvents,
   sleepForm,
   config,
   user
})

export default sleepApp