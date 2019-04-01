const merge = require('webpack-merge')
const common = require('./common.js')
const webpack = require('webpack')

module.exports = merge(common[0], {
  mode: 'development',
  devtool: 'inline-eval-cheap-source-map',
  devServer: {
	//lazy: true,
	publicPath: '/assets/',
	compress: true,
	port: 1400,
	index: 'build/index.prod.html',
	disableHostCheck: true,
	headers: {
		'X-Served-By': 'webpack'
	},
	watchOptions: {
		ignored: /node_modules/
	},
	historyApiFallback: {
		index: 'build/index.prod.html'
	},
	proxy: {
        '/': {
            target: `http://localhost:1337`, // only for POST?
            bypass: function(req, res, proxyOptions) {
                if(req.method != 'POST') return false;
            }
        }
    }
  },
  output: {
	pathinfo: false
  },
  module: {
	rules: [
		{
			test: /\.(css|scss)$/,
			exclude: /node_modules/,
			use: [
				'style-loader',
				{
					loader: "typings-for-css-modules-loader",
					options: {
						namedExport: true,
						camelCase: true,
						modules: true,
						localIdentName: "[path]___[name]__[local]___[hash:base64:5]"
					}
				},
				{ 
					loader: "sass-loader",
					options: {
						sourceMap: true,
						sourceMapContents: true
					}
				} 
			]
		}
	  ]
	},
	plugins: [
		new webpack.WatchIgnorePlugin([
      /scss\.d\.ts$/
    ])
	]
})