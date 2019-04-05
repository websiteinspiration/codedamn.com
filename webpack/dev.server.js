const merge = require('webpack-merge')
const common = require('./common.js')

module.exports = merge(common[1], {
	mode: 'development',
	module: {
		rules: [{
			test: /^\.tsx?$/,
			use: [{
				loader: 'awesome-typescript-loader',
				options: {
					transpileOnly: true,
					experimentalWatchApi: true,
				}
			}]
		}]
	}
})