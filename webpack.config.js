var path = require('path');
var webpack = require('webpack');

module.exports = {
	context: path.resolve(__dirname, 'charts'),
	entry: './charts.js',
	output: {
		path: path.resolve(__dirname, 'charts'),
		filename: 'charts.bundle.js'
	},
	module: {
		loaders: [{
			test: /\.js$/,
			loader: 'babel-loader',
			query: {
				presets: ['es2015']
			},
			exclude: [ 'node_modules' ]	
		},{
			test: /\.json$/,
			loader:'json-loader'
		},{
			test: /\.css$/,
			loader: 'style-loader'
		},{
			test: /\.css$/,
			loader: 'css-loader'
		},{
			test: /\.(jpe?g|png|gif|svg)$/i,
			loader: 'file-loader'
		}]
	},
	stats: {
		colors: true
	},
	target: 'web',
	devtool:'source-map'
};
