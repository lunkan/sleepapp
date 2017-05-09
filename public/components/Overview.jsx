import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Chart from 'chart.js';
import sleepBarChart from '../charts/sleepBarChart.js';
import Moment from 'frozen-moment';

import SleepEvent from '../helpers/SleepEvent.js';
import { MS_PER_DAY, MS_PER_HOUR, humanizeDuration } from '../helpers/time-formats.js';

import PageHeader from './PageHeader.jsx';

sleepBarChart(Chart);

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

		const options = {
		    maintainAspectRatio: false,
		    tooltips: {
		    	callbacks: {
		    		title: function(items, data) {
		    			return items[0].xLabel.format('MMM DD YYYY');
		    		},
		    		label: function(item, data) {
		    			return humanizeDuration(item.yLabel, true);
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
	                    max: MS_PER_DAY,
	                    stepSize: MS_PER_HOUR * 2,
	        			callback: function format(value) {
	        				return Moment.duration(value).asHours() + 'h';
	        			}
	                }
	            }, {
	            	id: 'momentScaleY',
                	ticks: {
	        			beginAtZero: true,
	        			max: MS_PER_DAY,
	        			stepSize: MS_PER_HOUR * 2,
	        			callback: function format(value) {
	        				var moment = Moment().startOf('day').add(value);
	        				return moment.format('HH:mm');
	        			}
	        		}
	        	}]
	        }
	    }

		const data = {
		    datasets: [{
            	type: 'sleepBarChart',
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
	        	type: 'sleepBarChart',
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
            	lineTension: 0.25,
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

		if(this.sleepChart) {
			this.sleepChart.destroy();
		}

		this.sleepChart = new Chart(this.canvas, {
		    data: data,
		    options: options
		});
	}

	render() {
		return (
			<div>
				<PageHeader pageTitle="Graph"/>
				<div style={{margin:20,height:'70vh'}}>
					<canvas ref={(canvas) => { this.canvas = canvas; }} width="100%" height="100%"/>
				</div>
			</div>
		);
	}
}

function select(state) {
	const {
		dayBeginsAtHour,
		durationThreshold,
		durationTrendThreshold,
		durationTrendTension,
		durationTrendInterval,
		durationTrendIntervalMax
	} = state.config;

	const { from, to } = state.config.eventFilter;
	const { sleepEvents } = state;

	const preSleepEventData = [];
	const sleepEventData = [];
	const sleepDurationData = [];
	const sleepDurationTrendData = [];

	//Set interval (days) for duration trend - adapted to num days displayed.
	const trendMinInterval = Math.floor(
		Math.min(100, (to || Moment()).diff(from || Moment(0), 'days')) / 10
	);

	var trend = 0;

	//Filter by timespan, or display all if not provided
	sleepEvents.filter(e => e.intersect(from, to))

		//Split sleep-events that spans over 2 days
		.reduce((acc, e) => acc.concat(e.breakApart(dayBeginsAtHour)), [])

		//Group events into days (each day displays one bar along x axis)
		.group(e => e.preSleep.startOf('day').format())

		//Push data into 4 separate datasets:
		//(presleep bar, sleep bar, sleep duration line, sleep duration trend line)
		.forEach(day => {
			const { key, data } = day;
			const dayMoment = Moment(key);

			//Push bar data
			//Sleep graph expects y & r values to be normalized as % of a day
			//Where 1h = 1/24
			data.forEach(e => {
				preSleepEventData.push({
					x: dayMoment,
					y: e.preSleep.diff(dayMoment) / MS_PER_DAY,
					r: e.preSleepDuration / MS_PER_DAY
				});

				sleepEventData.push({
					x: dayMoment,
					y: e.sleep.diff(dayMoment) / MS_PER_DAY,
					r: e.sleepDuration / MS_PER_DAY
				});
			});

			//Sum duration of sleep for this single day 
			var sleepDuration = data.reduce((acc, e) => acc + e.sleepDuration, 0);

			//Select only data with reasonable sleep duration (not to different from trend and duration minimum)
			//Unselected data is considered to contain missing log data
			if(sleepDuration > trend * durationTrendThreshold && sleepDuration > durationThreshold) {
				sleepDurationData.push({
					x: dayMoment,
					y: sleepDuration
				});

				trend = (trend || sleepDuration) * (1 - durationTrendTension) + sleepDuration * durationTrendTension;

				//Select only trend data within reasonable interval for readability
				if(!sleepDurationTrendData.length || sleepDurationTrendData.last().x.diff(dayMoment, 'days') < -trendMinInterval) {
					sleepDurationTrendData.push({
						x: dayMoment,
						y: trend
					});
				}
			}
		});

	return {
		graphData: {
			preSleep: preSleepEventData,
			sleep: sleepEventData,
			sleepSum: sleepDurationData,
			sleepSumTrend: sleepDurationTrendData,
		},
		timeSpan: {
			fromDate: from || sleepEventData[0] ? sleepEventData[0].x : undefined,
			toDate: to ||  sleepEventData.last() ? sleepEventData.last().x : undefined,
		}
	}
}

export default connect(select)(Overview)