const merge = require('webpack-merge')
const common = require('./common.js')

module.exports = merge(common[0], {
  mode: 'development',
  devtool: 'inline-eval-cheap-source-map',
  devServer: {
	//lazy: true,
	publicPath: '/assets/',
	compress: true,
	port: 1400,
	index: 'index.prod.html',
	disableHostCheck: true,
	headers: {
		'X-Served-By': 'webpack'
	},
	watchOptions: {
		ignored: /node_modules/
	},
	historyApiFallback: {
		index: 'index.prod.html'
	},
	/*proxy: {
        '/': {
            target: `http://localhost:1337`, // only for POST?
            bypass: function(req, res, proxyOptions) {
                if(req.method != 'POST') return false;
            }
        }
    },*/
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
					loader: "css-loader",
					options: {
						importLoaders: 2,
						modules: true,
						url: false,
						sourceMap: true,
						localIdentName: '[local]___[hash:base64:4]',//_____________________[hash:base64:5]'
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
		},
		{
			test: /^\.css$/,
			include: /node_modules/,
			use: ['style-loader', 'css-loader']
		}
	  ]
  }
})