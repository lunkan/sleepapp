'use strict';

module.exports = function(Chart) {

	Chart.controllers.sleep = Chart.DatasetController.extend({

		// Create elements for each piece of data in the dataset. Store elements in an array on the dataset as dataset.metaData
	    addElements: function() {
	    	var dataset = this.getDataset();
	    	dataset.metaData = [];
	    },

	    // Create a single element for the data at the given index and reset its state
	    addElementAndReset: function(index) {
	    	var meta = this.getMeta();
	    	meta.data.push({
	    		foo: 'bar',
	    		_view: {
	    			skip: false
	    		},
	    		inRange: function() {
	    			return false;
	    		}
	    	});
	    },

	    // Draw the representation of the dataset
	    // @param ease : if specified, this number represents how far to transition elements. See the implementation of draw() in any of the provided controllers to see how this should be used
	    draw: function(ease) {
			var ctx = this.chart.chart.ctx;
			var chartArea = this.chart.chartArea;
			var elements = this.getMeta().data;
			var dataset = this.getDataset();
			var ilen = elements.length;

			var meta = this.getMeta();
			var xScale = this.getScaleForId(meta.xAxisID);

			var xSize = (chartArea.right - chartArea.left);
			var ySize = (chartArea.bottom - chartArea.top);
			var rSize = xSize / (xScale.scaleSizeInUnits*2);

			ctx.fillStyle= dataset.backgroundColor[0];
			ctx.strokeStyle = dataset.borderColor[0];

			Chart.canvasHelpers.clipArea(ctx, chartArea);
			for (let i=0; i<ilen; i++) {
				let d = dataset.data[i];
				ctx.fillRect(d.x*xSize+chartArea.left-rSize/2, d.y*ySize+chartArea.top,rSize, d.r*ySize);
				ctx.strokeRect(d.x*xSize+chartArea.left-rSize/2, d.y*ySize+chartArea.top,rSize, d.r*ySize);
			}
			Chart.canvasHelpers.unclipArea(ctx);
	    },

	    /*// Remove hover styling from the given element
	    removeHoverStyle: function(element) {
	    	//console.log('removeHoverStyle');
	    },

	    // Add hover styling to the given element
	    setHoverStyle: function(element) {
	    	//console.log('setHoverStyle');
	    },

	    // Update the elements in response to new data
	    // @param reset : if true, put the elements into a reset state so they can animate to their final values
	    update: function(reset) {
	    	//console.log('update', this);
	    },*/

		initialize: function(chart, datasetIndex) {
			Chart.DatasetController.prototype.initialize.call(this, chart, datasetIndex);

			var me = this;
			var meta = me.getMeta();
			var dataset = me.getDataset();

			meta.stack = dataset.stack;
			// Use this to indicate that this is a sleep dataset.
			meta.sleep = true;
		},
	});
};