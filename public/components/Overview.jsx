import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Chart from 'chart.js';
import SleepChart from '../charts/sleep.js';
import Moment from 'moment';

import PageHeader from './PageHeader.jsx';

import EventMap from '../helpers/eventmap.js';

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
	            	id: 'momentScaleX',
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
	            	id: 'linearScaleY',
	                ticks: {
	                	beginAtZero: true,
	                    max: 1440,
	                    stepSize: 120,
	        			callback: function format(value) {
	        				return value/60 + 'h';
	        			}
	                }
	            }, {
	            	id: 'momentScaleY',
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
            	type: 'sleep',
	           	label: "Pre-sleep",
	           	xAxisID: 'momentScaleX',
	           	yAxisID: 'momentScaleY',
	            backgroundColor: [
	                'rgba(255, 99, 132, 0.2)'
	            ],
	            borderColor: [
	                'rgba(255,99,132,1)'
	            ],
	            borderWidth: 1,
	            data: graphData.preSleep,
	        }, {
	        	type: 'sleep',
	           	label: "Sleep",
	           	xAxisID: 'momentScaleX',
	           	yAxisID: 'momentScaleY',
	            backgroundColor: [
	                'rgba(54, 162, 235, 0.2)'
	            ],
	            borderColor: [
	                'rgba(54, 162, 235, 1)'
	            ],
	            borderWidth: 1,
	            data: graphData.sleep,
	        }, {
                type: 'line',
                label: 'Daysleep',
                xAxisID: 'momentScaleX',
	           	yAxisID: 'linearScaleY',
	           	fill: true,
	           	spanGaps: false,
	           	pointRadius: 1,
	           	pointHitRadius: 10,
            	lineTension: 0.1,
                backgroundColor: [
	                'rgba(150,150,150,0.1)'
	            ],
                borderColor: [
	                'rgba(150,150,150,0.2)'
	            ],
	            borderWidth: 1,
                data: graphData.sleepSum,
            }, {
                type: 'line',
                label: 'Daysleep trend',
                xAxisID: 'momentScaleX',
	           	yAxisID: 'linearScaleY',
	           	fill: false,
	           	pointRadius: 1,
	           	pointHitRadius: 10,
            	lineTension: 0.1,
            	backgroundColor: [
	                'rgba(150,150,150,0)'
	            ],
                borderColor: [
	                'rgba(0,0,0,1)'
	            ],
	            borderWidth: 1,
                data: graphData.sleepSumTrend,
            }]
		};

		var myBarChart = new Chart(ctx, {
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
	var eventMap = new EventMap(state.sleepEvents);

	var normalizedPreSleepEvents = [];
	var normalizedSleepEvents = [];
	var sleepSumEvents = [];
	var sleepSumTrendEvents = [];
	var firstDate, lastDate;

	eventMap.sumDays().forEach(day => {
		var durationMinutes = day.sleepDuration / 60000;

		if(durationMinutes >= 600) {
			sleepSumEvents.push({
				x: day.moment,
				y: durationMinutes
			});
		}	
	});

	var trend = sleepSumEvents[0] ? sleepSumEvents[0].y : 0;

	sleepSumEvents.forEach(daysleep => {
		trend = trend*0.9 + daysleep.y*0.1;
		sleepSumTrendEvents.push({
			x: daysleep.x,
			y: trend
		});
	});


	if(Array.isArray(state.sleepEvents) && state.sleepEvents.length) {
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
      	sleep: normalizedSleepEvents,
      	sleepSum: sleepSumEvents,
      	sleepSumTrend: sleepSumTrendEvents, 
	  },
      timeSpan: {
      	fromDate: firstDate,
      	toDate: lastDate
      }
   }
}

export default connect(select)(Overview)