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
try {
	pubcl.getProducts().then(d => { setState("products", d) })
	pubcl.getProductOrderBook().then(d => { setState("productOrderBook", d) })
	pubcl.getProductTicker().then(d => { setState("productTicker", d) })
	pubcl.getProductTrades().then(d => { setState("productTrades", d) })
//	pubcl.getProductTradeStream().then(d => { setState("productTradeStream", d) })
	pubcl.getProductHistoricRates().then(d => { setState("productHistoricRates", d) })
	pubcl.getProduct24HrStats().then(d => { setState("product24HrStats", d) })
	pubcl.getCurrencies().then(d => { setState("currencies", d) })
	pubcl.getTime().then(d => { setState("remotetime", d) })
} catch (e) { console.log(e) }

setInterval(updateTicker, 1000);

function updateTicker() {
	pubcl.getProductTicker(state.product).then(d => setState("productTicker", d))
}

app.use(express.static('charts'));
app.get('/gdax', (req, res) => {
	res.writeHead(200, {'Content-Type':'application/json'});
	res.end(JSON.stringify(state));
});
app.listen(8888, () => ('app listening on 8888'));
