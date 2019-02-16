const self = `'self'`
const unsafeInline = `'unsafe-inline'`
const ifProduction = process.env.NODE_ENV === 'production'
export default {
	// Specify directives as normal.
	directives: {
	  defaultSrc: [self],
	  frameSrc: [self, '*.facebook.com', '*.google.com', 'www.youtube.com'],
	  mediaSrc: [self, 'ssl.gstatic.com'], // accessibility
	  scriptSrc: [self, unsafeInline, 'cdn.polyfill.io', 'connect.facebook.net', 'cdn.ravenjs.com', 'www.google-analytics.com', '*.google.com', 'www.gstatic.com'],
	  styleSrc: [self, unsafeInline, 'fonts.googleapis.com'],
	  fontSrc: [self, 'data:', 'fonts.gstatic.com'],
	  connectSrc: [self, 'graph.facebook.com', 'sentry.io', 'www.google-analytics.com'],
	  imgSrc: [self, '*.doubleclick.net', 'www.facebook.com', '*.google.com', 'www.google.com', 'www.google-analytics.com', 'codedamn.com', 'data:'],
	 // sandbox: ['allow-popups', 'allow-same-origin', 'allow-forms', 'allow-scripts'],
	  reportUri: 'https://sentry.io/api/1226318/security/?sentry_key=718860c7f084473ab5d175647d6d74f3',
	  objectSrc: ["codedamn.com"],
	  upgradeInsecureRequests: ifProduction,
	  workerSrc: false  // This is not set.
	},
  
	// This module will detect common mistakes in your directives and throw errors
	// if it finds any. To disable this, enable "loose mode".
	loose: false,
  
	// Set to true if you only want browsers to report errors, not block them.
	// You may also set this to a function(req, res) in order to decide dynamically
	// whether to use reportOnly mode, e.g., to allow for a dynamic kill switch.
	reportOnly: false,
  
	// Set to true if you want to blindly set all headers: Content-Security-Policy,
	// X-WebKit-CSP, and X-Content-Security-Policy.
	setAllHeaders: false,
  
	// Set to true if you want to disable CSP on Android where it can be buggy.
	disableAndroid: false,
  
	// Set to false if you want to completely disable any user-agent sniffing.
	// This may make the headers less compatible but it will be much faster.
	// This defaults to `true`.
	browserSniff: true
}