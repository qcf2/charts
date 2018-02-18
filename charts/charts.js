import {bb} from 'billboard.js';
import * as d3 from 'd3';
import 'billboard.js/dist/billboard.css';
window.bb = bb;
window.d3 = d3;

class store
{
	constructor(parms) {
		/*
			productTicker: ...,
			productHistoricRates: [[ts,low, high, open, close, volume ]]
		*/
		this.state = {
			gdax: null,
		}
		this.cb = [];
	}
	dispatch(action) {
		if (action.name === "setGdax") {
			this.state.gdax = action.gdax;
		} else if (action.name === "setRefresh") {
			if (action.data && action.data.productTicker) {
				this.state.gdax.productTicker = action.data.productTicker;
			}	
		}
		for (let f in this.cb) {
			this.cb[f](this.state, this);
		}
	}
	addCb(fn) {
		this.cb.push(fn);
	}
}
window.store = new store();
window.chartloaded = false;
function updateChart(selector, tickerdata) {
	if (!window.chartloaded) {
		console.log(tickerdata);
		window.chartloaded = bb.generate({
			data: {
				x: "x",
				columns: tickerdata,
				type: "step",
			},
			axis: {
				x:{type: "timeseries", format: "%s"}
			},
			bindto: selector
		})
	} else {
		window.chartloaded.load({
			columns: tickerdata
		})
	}
}
window.updateChart = updateChart;
function getGdax() {
	fetch('/gdax')
		.then(r => r.json())
		.then(data => {
			window.store.dispatch({
				name: "setGdax",
				gdax: data
			});
			startPolling();
		});
		
}
window.getGdax = getGdax;
let tickerdata = ['p'];
let timedata = ["x"];
window.store.addCb(function(state, store){
	document.title = state.gdax.product + ": " + state.gdax.productTicker.price;
	let hist = state.gdax.productHistoricRates;
	let tick = state.gdax.productTicker;
	//console.log("Checking data for chart: ", hist, tick);
	if (hist && tick) {
		if (tickerdata.length === 1) {
			let ln = hist.length;
			console.log("Doing hist: ", hist, ln);
			while (ln--) {
				timedata.push(hist[ln][0])
				tickerdata.push(hist[ln][4])
			}
		}
		let n = 500;
		if (tickerdata.length > n) {
			tickerdata = tickerdata.slice(tickerdata.length - n - 1, tickerdata.length)
			tickerdata.unshift("p")
			timedata = timedata.slice(timedata.length - n - 1, timedata.length)
			timedata.unshift("x")
		}
		//"2018-02-18T03:31:40.132000Z"
		timedata.push(new Date().getTime(tick.time) / 1000);
		tickerdata.push(tick.price);
		updateChart("#chart", [timedata, tickerdata]);
	}
})

window.refreshhdl = null;
function refresh() {
	fetch('/refresh')
		.then(r => r.json())
		.then(data => {window.store.dispatch({
			name: "setRefresh",
			data: data
		})});
}
function startPolling() {
	window.refreshhdl = setInterval(refresh, 500);
}
function stopPolling() {
	clearInterval(window.refreshhdl);
}
window.refresh = refresh;
window.startPolling = startPolling;
window.stopPolling = stopPolling;

