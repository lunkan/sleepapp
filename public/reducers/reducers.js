import { combineReducers } from 'redux';

import {
   SET_API_MESSAGE,
   CLEAR_API_MESSAGE,
   RECEIVE_SESSION,
   SET_CONFIG,
   RECEIVE_SLEEP_EVENT,
   INSERT_SLEEP_EVENT,
   UPDATE_SLEEP_EVENT,
   DELETE_SLEEP_EVENT,
   INIT_SLEEP_FORM,
   PUT_SLEEP_FORM
} from '../actions/actions';

import {
   MS_PER_DAY,
   MS_PER_HOUR,
   humanizeDuration
} from '../helpers/time-formats.js';

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

function session(state = {}, action) {
   switch (action.type) {
      case RECEIVE_SESSION:
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
         return action.data;

      case INSERT_SLEEP_EVENT:
         return state.concat(action.data);

      case UPDATE_SLEEP_EVENT:
         return state.reduce((acc, next, i) => {
            var updatedModel = action.data.filter(model => model.id === next.id);
            acc.push(updatedModel[0] || next);
            return acc;
         }, []);

      case DELETE_SLEEP_EVENT:
         return state.filter(model => model.id !== action.data);

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
   session
})

export default sleepApp