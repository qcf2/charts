const Gdax = require('gdax');
const fs = require('fs');
const path = require('path');
const timers = require('timers');
const express = require('express');
const app = express();
const pubcl = new Gdax.PublicClient();
const prod = 'BTC-USD';
const state = {
	product: prod,
	products: null,
	productOrderBook: null,
	productTicker: null,
	productTrades: null,
	productTradeStream: null,
	productHistoricRates: null,
	product24HrStats: null,
	currencies: null,
	remotetime: null,
	ts: {}
}
function printargs() { console.log(arguments) }
function setState(key, val) {
	state[key] = val;
	state.ts[key] = new Date().getTime();
}

setInterval(updateTicker, 1000);

function updateTicker() {
	pubcl.getProductTicker(state.product).then(d => setState("productTicker", d))
}
function updateFullState() {
	try {
		pubcl.getProducts().then(d => { setState("products", d) })
		pubcl.getProductOrderBook(state.product).then(d => { setState("productOrderBook", d) })
		pubcl.getProductTicker(state.product).then(d => { setState("productTicker", d) })
		pubcl.getProductTrades(state.product).then(d => { setState("productTrades", d) })
	//	pubcl.getProductTradeStream(state.product).then(d => { setState("productTradeStream", d) })
		pubcl.getProductHistoricRates(state.product).then(d => { setState("productHistoricRates", d) })
		pubcl.getProduct24HrStats(state.product).then(d => { setState("product24HrStats", d) })
		pubcl.getCurrencies().then(d => { setState("currencies", d) })
		pubcl.getTime().then(d => { setState("remotetime", d) })
	} catch (e) { console.log(e) }
}
updateFullState();

app.use(express.static('charts'));
app.get('/gdax', (req, res) => {
	res.writeHead(200, {'Content-Type':'application/json'});
	res.end(JSON.stringify(state));
});
app.get('/refresh', (req, res) => {
	res.writeHead(200, {'Content-Type':'application/json'});
	res.end(JSON.stringify({productTicker: state.productTicker}));
});
app.listen(8888, () => ('app listening on 8888'));
