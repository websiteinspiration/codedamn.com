import React from 'react'

// JS testing only
import consoleJS from './console.txt'
import jquery from './jquery.txt'
import chai from './chai.txt'

//@css(styles)
// TODO: Convert this into functional component
class iFrame extends React.Component<any, any> {

	iframe = null

	constructor(props) {
		super(props)
		this.state = { busy: false, iframe: <iframe sandbox="allow-modals allow-forms allow-pointer-lock allow-popups allow-orientation-lock allow-same-origin allow-scripts allow-top-navigation" ref={e => { this.iframe = e; e && this.initializeIframe() }} className="iframe" src="about:blank"></iframe> }
		this.handleIframe = this.handleIframe.bind(this)
	}

	shouldComponentUpdate(nextProps, nextState) {
		//console.warn(this.props.uid !== nextProps.uid ? 'Updating iframe': '')
		if(this.props.uid !== nextProps.uid) {
			this.setState({
				iframe: null,
			}, () => {
				// to reset const variables on page. Otherwise they throw already declared error
				
				this.setState({
					iframe: <iframe sandbox="allow-modals allow-forms allow-pointer-lock allow-popups allow-orientation-lock allow-same-origin allow-scripts allow-top-navigation" ref={e => { this.iframe = e; e && this.initializeIframe() }} className="iframe" src="about:blank"></iframe> 
				})
				// should actually go in setState callback, but it setState's callback is called after shouldComponentUpdate
			})
		} // && this.props.rawCode !== nextProps.rawCode
		//debugger
		return this.state.iframe !== nextState.iframe
	}

	componentDidMount() {
		window.addEventListener("message", this.handleIframe)
	}

	componentWillUnmount() {
		window.removeEventListener("message", this.handleIframe)
	}

	injectBeforeScripts() {
		return `<script>
				${consoleJS};
				</script>`
	}

	injectAfterScripts() {
		const tests = this.props.tests
		const script = `<script>

			String.prototype.has = function(regexOrString) {
				if(typeof regexOrString === "string") {
					return this.indexOf(regexOrString) !== -1
				}
				return this.search(regexOrString) !== -1
			}

			${chai};
			var code = "${btoa(this.props.rawCode)}"
			code = atob(code)
			var tests = ${JSON.stringify(tests)}
			var assert = chai.assert
			var updatedTests = tests.map(test => {
				try {
					eval(test.testString) // TODO: async?
					return { title: test.text, status: true }
				} catch(e) {
					return { title: test.text, status: false }
				}
			})

			parent.postMessage(updatedTests, "*")
		</script>`

		return script;
	}

	initializeIframe() {
		const contents = this.props.rawCode
		
		// this.iframe.contentWindow.code = contents FIREEEEEEEEEEEEEEEEEEEEEFOXXXXXXXXXXXXXXXXXXXXXXX!!!!!!!!!!!! X-((((((((
		// this.iframe.contentWindow.chai = chai
		
		if(!contents || contents.trim() === "") {

			const rawHTML = `<style>*{box-sizing:border-box;margin:0;padding:0}</style><div style="padding:10px;width:100vw;height:100vh;display:flex;justify-content:center;align-items:center;text-align:center;"><h1 style="font-family: calibri">Hit F9 key in editor to run</h1></div>`
			this.iframe.contentWindow.document.open()
			
			const div = this.injectAfterScripts()

			this.iframe.contentWindow.document.write(rawHTML + div)

			this.iframe.contentWindow.document.close()
			

		} else {
			//this.iframe.contentWindow.document.location.href = "about:blank"
			

			this.iframe.contentWindow.document.open()
			this.iframe.contentWindow.document.write(`
				<!doctype HTML>
				<html>
					<head></head>
					<body>
						<script>
							${jquery};
							// var ___CODEDAMN__jquery = jQuery.noConflict()
							window.onload = function() {
								parent.postMessage('sendcontents', '*');
							}
						</script>
					</body>
				</html>
			`)

			this.iframe.contentWindow.document.close()
			//this.iframe.contentWindow.removeEventListener('load', this.writeContent)
			
		}
		
	}


	handleIframe(e) {
		const data = e.data || e.message
		console.log('data!!')
		if(Array.isArray(data)) {
			const testResults = {}
			data.map(test => {
				testResults[test.title] = test.status ? 1 : 0
			})
			this.props.parentUpdateState(testResults)
		} else if(data === 'sendcontents') {
			// this.iframe.contentWindow.document.open()
			
			let contents = this.props.rawCode

			console.log(`We're operating in ${this.props.mode}`)

			if(this.props.mode === 'js-only') {
				// we're expecting only javascript code
				contents = `<script>
${contents}
;
				</script>`
			}

			this.iframe.contentWindow.$('head').append(this.injectBeforeScripts())
			this.iframe.contentWindow.$('body').append(contents)
			this.iframe.contentWindow.$('head').append(this.injectAfterScripts())

			// this.iframe.contentWindow.document.close()
		}
	}

	render() {
		return (
			<div className="rightiframe">
				<div className="iframe-header">https://localhost:1337/</div>
				{this.state.iframe}
			</div>)
	}

}

// let com = css(styles)(iFrame)

export default iFrame