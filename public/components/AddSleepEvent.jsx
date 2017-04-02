import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Moment from 'moment'

import { addSleepEvent } from '../actions/actions'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton'
import DatePicker from 'material-ui/DatePicker'
import TimePicker from 'material-ui/TimePicker'
   
class AddSleepEvent extends Component {

   constructor() {
      super();
      this.handleUpdate = this.handleUpdate.bind(this);
      this.formatData = this.formatData.bind(this);
      this.formatTime = this.formatTime.bind(this);
      this.state = this.formatData({});
   }

   componentWillMount() {
      const {editData} = this.props;
      this.setState(this.formatData(editData || {}));
   }

   render() {
      return (
         <div>
            <DatePicker ref="dateInput" onChange={(e, value) => this.handleUpdate({date: value})} floatingLabelText="Date" value={this.state.date.toDate()} autoOk={true} />
            <TimePicker ref="startTimeInput" onChange={(e, value) => this.handleUpdate({startTime: value})} format="24hr" floatingLabelText="Start time" value={this.state.startTime.toDate()} autoOk={true} />
            <TimePicker ref="sleepTimeInput" onChange={(e, value) => this.handleUpdate({sleepTime: value})} format="24hr" floatingLabelText="Sleep time" value={this.state.sleepTime.toDate()} autoOk={true} /> 
            <TimePicker ref="endTimeInput" onChange={(e, value) => this.handleUpdate({endTime: value})} format="24hr" floatingLabelText="End time" value={this.state.endTime.toDate()} autoOk={true} />
         </div>
      )
   }

   formatData(data) {
      //Accept js Dates, but convert to moment
      for (var key in data) {
         if(data[key] instanceof Date) {
            data[key] = Moment(data[key]);
         }
      }

      let date = data.date || data.startTime || Moment();
      date = date.clone().startOf('day');

      let startTime = this.formatTime(date, data.startTime || date.clone());
      let sleepTime = this.formatTime(startTime, data.sleepTime || startTime.clone());
      let endTime = this.formatTime(sleepTime, data.endTime || sleepTime.clone());

      return {
         date: date,
         startTime: startTime,
         sleepTime: sleepTime,
         endTime: endTime
      }
   }

   formatTime(base, time) {
      let formatedTime = base.clone().startOf('day');
      formatedTime.hours(time.hours()).minutes(time.minutes());

      //Add one day if time hours is less than base
      //must be next day (example 23:00 -> 01:00)
      //floor minutes if hours are same and base is later
      //next time can never be before base (autocorrect misstake)
      if(base.hours() > time.hours()) {
         formatedTime.add(1, 'days');
      } else if(base.hours() === time.hours() && base.minutes() > time.minutes()) {
         formatedTime.minutes(base.minutes());
      }

      return formatedTime; 
   }

   handleUpdate(data) {
      let currentState = Object.assign({}, this.state);
      Object.assign(currentState, data);
      let nextState = this.formatData(currentState);

      this.setState(nextState);

      if(this.props.onUpdate) {
         this.props.onUpdate(nextState)
      }
   }
}

function select(state) {
   return {
      events: state.sleepEvents || []
   }
}

export default connect(select)(AddSleepEvent)