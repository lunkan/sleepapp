import { combineReducers } from 'redux'
import { RECEIVE_SLEEP_EVENT, INIT_SLEEP_FORM, PUT_SLEEP_FORM } from '../actions/actions';

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
         return Object.assign(state, action.data);

      default:
         return state
   }
}

const sleepApp = combineReducers({
   sleepEvents,
   sleepForm
})

export default sleepApp