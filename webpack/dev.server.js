const merge = require('webpack-merge')
const common = require('./common.js')

module.exports = merge(common[1], {
	mode: 'development',
	module: {
		rules: [{
			test: /^\.tsx?$/,
			use: [{
				loader: 'ts-loader',
				options: {
					transpileOnly: true,
					experimentalWatchApi: true,
				}
			}]
		}]
	}
})