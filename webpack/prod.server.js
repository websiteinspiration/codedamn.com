const merge = require('webpack-merge')
const common = require('./common.js')
const SentryPlugin = require('@sentry/webpack-plugin')

module.exports = merge(common[1], {
	mode: 'production',
	plugins: [
		/*new SentryPlugin({
			release: require('../package.json').version,
			include: '../server',
			ignore: ['node_modules'],
			debug: false,
			configFile: 'sentry-server.properties'
		})*/
	]
})