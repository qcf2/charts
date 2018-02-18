const Gdax = require('gdax')
const fs = require('fs')
const path = require('path')
const timers = require('timers')
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
} catch (e) { console.log(e)}

setInterval(updateTicker, 250);

function updateTicker() {
	pubcl.getProductTicker().then(d => setState("productTicker", d))
}

const http = require('http');
http.createServer(function(req, res) {
	if (req.url === "/gdax") {
		res.writeHead(200, {'Content-Type':'application/json'});
		res.end(JSON.stringify(state));
	} else {
		let filepath = '.'+req.url;
		if (filepath === './') filepath = './index.html';
		console.log("serving: " + filepath);
		let ext = path.extname(filepath);
		let contentType = 'text/html';
		switch(ext) {
			case '.js': contentType = 'text/javascript'; break;
			case '.js.map': contentType = 'text/javascript'; break;
			case '.css': contentType = 'text/css'; break;
			case '.json': contentType = 'application/json'; break;
			case '.png': contentType = 'image/png'; break;
			case '.jpg': contentType = 'image/jpg'; break;
			case '.wav': contentType = 'audio/wav'; break;
		}
		fs.readFile(filepath, function(err, data) {
			if (err) {
				console.log("error", err);
				res.writeHead(500);
				res.end();
			} else {
				res.writeHead(200, {'Content-Type':contentType});
				res.write(data);
				res.end();
			}
		});
	}
}).listen(8888, 'localhost')
