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

var myBarChart;
var chartId = 0;

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

	componentWillUpdate() {
		if(myBarChart) {
			myBarChart.destroy();
		}

		while (this.graphContainer.firstChild) {
    		this.graphContainer.removeChild(this.graphContainer.firstChild);
		}
	}

	componentDidUpdate() {
		this.drawGraph();
	}

	drawGraph() {
		const { graphData, timeSpan } = this.props;

		chartId++;

		var ctx = document.createElement('canvas');
		ctx.id = `SleepGraph_${chartId}`;
		ctx.setAttribute('width', '100%');
		ctx.setAttribute('height', '100%');

		this.graphContainer.appendChild(ctx);

		//var ctx = document.getElementById("myChart");

		var options = {
		    maintainAspectRatio: false,
		    tooltips: {
		    	callbacks: {
		    		title: function(items, data) {
		    			return items[0].xLabel.format('MMM DD YYYY');
		    		},
		    		label: function(item, data) {
		    			var hours = Math.floor(item.yLabel / 60);
		    			var minutes = Math.floor(item.yLabel - (hours * 60));
		    			return `${hours}h ${minutes}m`;
		    		}
		    	}
		    },
	        scales: {
	            xAxes: [{
	            	id: 'momentScaleX',
	            	type: 'time',
	            	time: {
	            		min: timeSpan.fromDate,
	        			max: timeSpan.toDate,
	        			round: 'day',
	        			minUnit: 'day'
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

		myBarChart = new Chart(ctx, {
		    data: data,
		    options: options
		});
	}

	render() {
		return (
			<div>
				<PageHeader pageTitle="Graph"/>
				<div ref={(container) => { this.graphContainer = container; }} style={{margin:20,height:'70vh'}}></div>
			</div>
			)
	}
}

function normalizeTime(moment) {
	let minutes = moment.get('hour') * 60 + moment.get('minute');
	return 1 - (minutes / MIN_PER_DAY);
}

function select(state) {
	var { from, to } = state.config.eventFilter;

	var filteredEvents = state.sleepEvents.filter(e => e.startTime.diff(from || Moment(0)) > 0);
	var eventMap = new EventMap(filteredEvents);

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


	if(Array.isArray(filteredEvents) && filteredEvents.length) {
		firstDate = filteredEvents[0].startTime.clone().subtract(1, 'd').startOf('day');
		lastDate = filteredEvents[filteredEvents.length-1].endTime.clone().add(1, 'd').startOf('day');

		filteredEvents.forEach(e => {
			var nStart = normalizeTime(e.startTime);
			var nSleep = normalizeTime(e.sleepTime);
			var nEnd = normalizeTime(e.endTime);

			if(e.startTime.date() !== e.sleepTime.date()) {
				normalizedPreSleepEvents.splice(-1, 0, {
					x: e.startTime.clone(),
					y: nStart,
					r: 0 - nStart
				}, {
					x: e.sleepTime.clone,
					y: MIN_PER_DAY,
					r: nSleep - MIN_PER_DAY,
				});
			} else {
				normalizedPreSleepEvents.push({
					x: e.startTime.clone(),
					y: nStart,
					r: nSleep - nStart,
				})
			}

			if(e.sleepTime.date() !== e.endTime.date()) {
				normalizedSleepEvents.splice(-1, 0, {
					x: e.sleepTime.clone(),
					y: nSleep,
					r: 0 - nSleep,
				}, {
					x: e.endTime.clone(),
					y: MIN_PER_DAY,
					r: nEnd - MIN_PER_DAY,
				});
			} else {
				normalizedSleepEvents.push({
					x: e.sleepTime.clone(),
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
      	fromDate: from || firstDate,
      	toDate: to || lastDate
      }
   }
}

export default connect(select)(Overview)