import { combineReducers } from 'redux'
import { RECEIVE_SLEEP_EVENT, ADD_SLEEP_EVENT, UPDATE_SLEEP_EVENT, DELETE_SLEEP_EVENT } from '../actions/actions'

function sortEvents(a, b) {
   return a.data.startTime.diff(b.data.startTime);
}

function sleepEvents(state = [], action) {
   switch (action.type) {
      case RECEIVE_SLEEP_EVENT:
         return action.events;

      default:
         return state
   }
}

const sleepApp = combineReducers({
   sleepEvents
})

export default sleepApp