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
function updateChart(selector, tickerdata) {
	var chart = bb.generate({
		data: {
			columns: [tickerdata]
		},
		bindto: selector
	})
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
let tickerdata = ['$'];
window.store.addCb(function(state, store){
	document.title = state.gdax.product + ": " + state.gdax.productTicker.price;
	let hist = state.gdax.productHistoricRates;
	let tick = state.gdax.productTicker;
	//console.log("Checking data for chart: ", hist, tick);
	if (hist && tick) {
		/*
		if (tickerdata.length === 1) {
			let ln = hist.length;
			while (ln--) {
				tickerdata.push(hist[ln][4])
			}
		}
		*/
		let n = 100;
		if (tickerdata.length > n) {
			tickerdata = tickerdata.slice(n, ticker.length)
			tickerdata.unshift("$")
		}
		tickerdata.push(tick.price);
		updateChart("#chart", tickerdata);
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

