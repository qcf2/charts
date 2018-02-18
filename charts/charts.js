import {bb} from 'billboard.js';
import * as d3 from 'd3';
import 'billboard.js/dist/billboard.css';
window.bb = bb;
window.d3 = d3;

class store
{
	constructor(parms) {
		this.state = {
			gdax: null,
		}
		this.cb = [];
	}
	dispatch(action) {
		if (action.name === "setGdax") {
			this.state.gdax = action.gdax;
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
function testChart(selector) {
	var chart = bb.generate({
		data: {
			columns: [['trend', 1, 2, 3, 4, 10, 30, 35, 30, 70, 71, 72, 71, 50, 101]]
		},
		bindto: selector
	})
}
window.testChart = testChart;
function getGdax() {
	fetch('/gdax')//.then(r => {window.store.dispatch({name: 'setGdax', gdax: r.blob})};
		.then(r => r.json())
		.then(data => {window.store.dispatch({
			name: "setGdax",
			gdax: data
		})});
		
}
window.getGdax = getGdax;
window.store.addCb(function(state, store){
	document.title = state.gdax.product + ": " + state.gdax.productTicker.price;
})


