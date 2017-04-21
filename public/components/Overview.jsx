import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Chart from 'chart.js';
import SleepChart from '../charts/sleep.js';
import Moment from 'moment';

import PageHeader from './PageHeader.jsx';

const MIN_PER_DAY = 1440;
const MS_PER_DAY = 86400000;

SleepChart(Chart);

class Overview extends Component {

	constructor() {
      super();

      this.state = {
      	graphData: null,
      	timeSpan: null
      }

      this.drawGraph = this.drawGraph.bind(this);
   }

	componentDidMount() {
		this.drawGraph();
	}

	componentDidUpdate() {
		this.drawGraph();
	}

	drawGraph() {
		const { graphData, timeSpan } = this.props;
		var ctx = document.getElementById("myChart");

		var options = {
		    maintainAspectRatio: false,
	        scales: {
	            xAxes: [{
	            	type: 'time',
	            	time: {
	            		unit: 'day',
	            		min: timeSpan.fromDate,
	        			max: timeSpan.toDate,
	        			displayFormats: {
	                        day: 'MMM D'
	                    }
	            	}
	            }],
	            yAxes: [{
                	ticks: {
	        			beginAtZero: true,
	        			max: 1440,
	        			stepSize: 120,
	        			callback: function format(value) {
	        				var moment = Moment().startOf('day').add(value, 'm');
	        				return moment.format('HH:mm');
	        			}
	        		}
	        	}]
	        }
	    }

		var data = {
		    datasets: [{
	           	label: "Pre-sleep",
	            backgroundColor: [
	                'rgba(255, 99, 132, 0.2)'
	            ],
	            borderColor: [
	                'rgba(255,99,132,1)'
	            ],
	            borderWidth: 1,
	            data: graphData.preSleep,
	        }, {
	           	label: "Sleep",
	            backgroundColor: [
	                'rgba(54, 162, 235, 0.2)'
	            ],
	            borderColor: [
	                'rgba(54, 162, 235, 1)'
	            ],
	            borderWidth: 1,
	            data: graphData.sleep,
	        }]
		};

		var myBarChart = new Chart(ctx, {
		    type: 'sleep',
		    data: data,
		    options: options
		});
	}

	render() {
		return (
			<div>
				<PageHeader pageTitle="Graph"/>
				<div style={{margin:20,height:'70vh'}}>
					<canvas id="myChart" width="100%" height="100%"></canvas>
				</div>
			</div>
			)
	}
}

function normalizeTime(moment) {
	let minutes = moment.get('hour') * 60 + moment.get('minute');
	return 1 - (minutes / MIN_PER_DAY);
}

function normalizeDay(moment, firstMoment, lastMoment) {
	return (moment.clone().startOf('day').unix() - firstMoment.unix()) / (lastMoment.unix() - firstMoment.unix());
}

function select(state) {
	var normalizedPreSleepEvents = [];
	var normalizedSleepEvents = [];
	var firstDate, lastDate;

	if(Array.isArray(state.sleepEvents) & state.sleepEvents.length) {

		firstDate = state.sleepEvents[0].startTime.clone().subtract(1, 'd').startOf('day');
		lastDate = state.sleepEvents[state.sleepEvents.length-1].endTime.clone().add(1, 'd').startOf('day');

		state.sleepEvents.forEach(e => {
			var nStart = normalizeTime(e.startTime);
			var nSleep = normalizeTime(e.sleepTime);
			var nEnd = normalizeTime(e.endTime);

			if(e.startTime.date() !== e.sleepTime.date()) {
				normalizedPreSleepEvents.splice(-1, 0, {
					x: normalizeDay(e.startTime, firstDate, lastDate),
					y: nStart,
					r: 0 - nStart
				}, {
					x: normalizeDay(e.sleepTime, firstDate, lastDate),
					y: MIN_PER_DAY,
					r: nSleep - MIN_PER_DAY,
				});
			} else {
				normalizedPreSleepEvents.push({
					x: normalizeDay(e.startTime, firstDate, lastDate),
					y: nStart,
					r: nSleep - nStart,
				})
			}

			if(e.sleepTime.date() !== e.endTime.date()) {
				normalizedSleepEvents.splice(-1, 0, {
					x: normalizeDay(e.sleepTime, firstDate, lastDate),
					y: nSleep,
					r: 0 - nSleep,
				}, {
					x: normalizeDay(e.endTime, firstDate, lastDate),
					y: MIN_PER_DAY,
					r: nEnd - MIN_PER_DAY,
				});
			} else {
				normalizedSleepEvents.push({
					x: normalizeDay(e.sleepTime, firstDate, lastDate),
					y: nSleep,
					r: nEnd - nSleep,
				})
			}
		});
	}

   return {
      graphData: {
      	preSleep: normalizedPreSleepEvents,
      	sleep: normalizedSleepEvents
	  },
      timeSpan: {
      	fromDate: firstDate,
      	toDate: lastDate
      }
   }
}

export default connect(select)(Overview)