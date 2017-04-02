import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Moment from 'moment'

import { red500, green500, grey400 } from 'material-ui/styles/colors';

import { Step, Stepper, StepLabel, StepContent } from 'material-ui/Stepper';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import { Card, CardText, CardActions } from 'material-ui/Card';

import IconTimer from 'material-ui/svg-icons/image/timer';
import IconTimerSleep from 'material-ui/svg-icons/av/snooze';
import IconTimerOff from 'material-ui/svg-icons/image/timer-off';
import IconClear from 'material-ui/svg-icons/content/clear';
import IconForward from 'material-ui/svg-icons/content/forward';

import Snackbar from 'material-ui/Snackbar';

import { addSleepEvent } from '../actions/actions'

import AddSleepEvent from './AddSleepEvent.jsx'

const TIMER_STATES = [
	'startTime',
	'sleepTime',
	'endTime'
];

class Timer extends Component {

constructor() {
      super();

		this.handleNext = this.handleNext.bind(this);
      this.handleComplete = this.handleComplete.bind(this);
      this.handleCancel = this.handleCancel.bind(this);
      this.onStopWatch = this.onStopWatch.bind(this);
      this.onFormUpdate = this.onFormUpdate.bind(this);
      this.onSave = this.onSave.bind(this);

      this.handleRequestClose = this.handleRequestClose.bind(this);

	this.state = {
      	stepIndex: 0,
      	formData: {
	     startTime: null,
	     sleepTime: null,
	     endTime: null
	 	},
      	stopWatchId: null,
      	messageOpen: false
      }

      
   }

	componentDidMount() {
	   var stopWatchId = setInterval(this.onStopWatch, 1000);

      this.setState({
      	stopWatchId: stopWatchId
      });
	}

	componentWillUnmount() {
	   clearInterval(this.state.stopWatchId);
	}


	handleNext() {
		const {stepIndex, formData} = this.state;

		formData[TIMER_STATES[stepIndex]] = Moment();

		this.setState({
	      stepIndex: stepIndex + 1,
	      formData: formData
	    });
	}

  handleComplete() {
    this.setState({
  		stepIndex: 3
  	});
  }

  handleCancel() {
  	this.setState({
  		stepIndex: 0,
      	formData: {
      		startTime: null,
      		sleepTime: null,
      		endTime: null
	 	}
  	})
  }

  onStopWatch() {
  	const {stepIndex} = this.state;
  	if(stepIndex > 0 && stepIndex <= 2) {
  		this.forceUpdate();
  	}
  }

onFormUpdate(data) {
  	this.setState({formData: {
	     startTime: Moment(data.startTime),
	     sleepTime: Moment(data.sleepTime),
	     endTime: Moment(data.endTime),
	  }})
  }

  onSave() {
  	const {formData} = this.state;
  	const {dispatch} = this.props;
	dispatch(addSleepEvent(formData));

	this.setState({
      messageOpen: true,
    });
  }

handleRequestClose() {
	this.setState({
      messageOpen: false,
    });

    this.handleCancel();
}

	render() {
		const {stepIndex, formData} = this.state;

		const layoutStyle = {
	  		height: '75vh',
	  		display: 'flex',
	  		flexDirection: 'column',
	  		justifyContent: 'space-between',
	  		alignItems: 'center'
	  	};

	  	const stepStyle = {
			flexGrow: 0,
	  		flexShrink: 0
	  	}

		const timerStyle = {
	  		flexGrow: 0,
	  		flexShrink: 0
	  	};

		const buttonStyle = {
			width: 150,
			height: 150
		};

		const iconStyle = {
			width: 120,
			height: 120
		};

		let iconButton;

      switch(stepIndex) {
        case 0:
          iconButton = <IconTimer style={iconStyle} onTouchTap={e => this.handleNext()} />
          break;
        case 1:
          iconButton = <IconTimerSleep style={iconStyle} onTouchTap={e => this.handleNext()} />
          break;
        case 2:
          iconButton = <IconTimerOff style={iconStyle} onTouchTap={e => this.handleNext()} />
          break;
      }

		let stopWatch = '00:00';
		if(formData[TIMER_STATES[stepIndex-1]]) {
			var diffMs = Moment().diff(formData[TIMER_STATES[stepIndex-1]]);
			stopWatch = Moment().startOf('day').add(Math.floor(diffMs/1000), 'seconds').format('HH:mm:ss');
  		}

	return (
		<div>
			{stepIndex < 3 ? (
				<div style={layoutStyle}>
					<Stepper style={stepStyle} activeStep={stepIndex} orientation="vertical">
		          		<Step>
		            		<StepLabel>Begin {formData.startTime ? formData.startTime.format('HH:mm') : ''}</StepLabel>
		            		<StepContent style={{fontFamily:"Roboto"}}></StepContent>
		          		</Step>
		          		<Step>
		            		<StepLabel>Sleeping {formData.sleepTime ? formData.sleepTime.format('HH:mm') : ''}</StepLabel>
		            		<StepContent style={{fontFamily:"Roboto"}}>{stopWatch}</StepContent>
		          		</Step>
		          		<Step>
		            		<StepLabel>Awake {formData.endTime ? formData.endTime.format('HH:mm') : ''}</StepLabel>
		            		<StepContent style={{fontFamily:"Roboto"}}>{stopWatch}</StepContent>
		          		</Step>
		        	</Stepper>
		        	<div>
						<FloatingActionButton backgroundColor={grey400}  style={timerStyle} iconStyle={buttonStyle}>
							{ iconButton }
						</FloatingActionButton>
						<div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
							<FloatingActionButton backgroundColor={red500}>
								<IconClear onTouchTap={e => this.handleCancel()}/>
							</FloatingActionButton>
							<FloatingActionButton backgroundColor={green500}>
								<IconForward onTouchTap={e => this.handleComplete()}/>
							</FloatingActionButton>
						</div>
					</div>
				</div>
			) : (
			<div style={layoutStyle}>
				<Card>
					<CardText>
						<AddSleepEvent editData={formData} onUpdate={this.onFormUpdate}/>
					</CardText>
					<CardActions>
					    <FlatButton label="Cancel" onTouchTap={e => this.handleCancel()}/>
					    <RaisedButton label="Save" onTouchTap={e => this.onSave()} primary={true}/>
					</CardActions>
				</Card>
				<Snackbar
		          open={this.state.messageOpen}
		          message="Event added"
		          autoHideDuration={4000}
		          onRequestClose={this.handleRequestClose}/>
			</div>
			)}
		</div>
		)
	}
}

function select(state) {
	return {}
}

export default connect(select)(Timer)