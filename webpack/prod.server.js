const merge = require('webpack-merge')
const common = require('./common.js')
const SentryPlugin = require('@sentry/webpack-plugin')
const path = require('path')

module.exports = merge(common[1], {
	mode: 'production',
	plugins: [
		new SentryPlugin({
			release: require('../package.json').version,
			include: '../build/server',
			ignore: ['node_modules'],
			debug: false,
			configFile: path.resolve(__dirname, '../sentry-server.properties')
		})
	]
})