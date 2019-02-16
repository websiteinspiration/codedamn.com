import React from 'react'
import styles from './styles.scss'
import css from 'react-css-modules'
import { Button, TextField } from '@material-ui/core'
import axios from 'axios'
import { fireNotification } from 'reducers/notifizer/actions'
import { connect } from 'react-redux'

@connect(null, { fireNotification })
@css(styles, { handleNotFoundStyleName: 'log', allowMultiple: true })
export default class Feedback extends React.Component {

	state = { name: "", email: "", message: "" }

	componentDidMount() {
		const script = document.createElement('script')
		script.src = 'https://www.google.com/recaptcha/api.js'
		script.async = true
		document.head.appendChild(script)
	}

	async sendFeedback() {

		const { name, email, message } = this.state
		const captcha = document.querySelector(`[name='g-recaptcha-response']`).value

		//const res = await fetch('/send-feedback', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({name, message, captcha}) })
		const { data } = await axios.post('/send-feedback', { name, email, message, captcha })
		if (data.status == "ok") {
			//
			this.props.fireNotification({
				heading: 'Success',
				body: 'Your message is received! We\'ll get back to you soon!'
			})
		} else {
			this.props.fireNotification({
				heading: 'Error',
				body: 'There were some errors sending your feedback. Try again?'
			})
		}
	}

	handleChange(key, value) {
		this.setState({ [key]: value })
	}

	render() {
		return (
			<div styleName="n60 feedbackParent">
				<h1>Welcome to codedamn v1.0</h1>
				<p>Thank you so much for making it so far! codedamn aims to bring value to developers all around the globe and connect them with appropirate communities. This platform is being actively developed and worked upon. <b>There are bugs, glitches, vulnerabilties, holes, broken elements, wrong resolutions, incorrect content, bad code, and WHAT NOT!</b> We understand all of that and want YOU to be a part of the team. Send a bug report or anything which annoys you using the form below. Since it's a feedback form, you can also praise us a little if you want ;)</p>
				<form styleName="container" onSubmit={e => { e.preventDefault() }}>

					<TextField
						id="something9"
						styleName="name"
						label="Name"
						variant="outlined"
						value={this.state.name}
						onChange={e => this.handleChange('name', e.target.value)}
						margin="normal"
					/>

					<TextField
						id="something10"
						styleName="email"
						label="Email"
						variant="outlined"
						value={this.state.email}
						onChange={e => this.handleChange('email', e.target.value)}
						margin="normal"
					/>

					<TextField
						id="something11"
						styleName="message"
						label="Message"
						variant="outlined"
						value={this.state.message}
						onChange={e => this.handleChange('message', e.target.value)}
						margin="normal"
						multiline={true}
						rows={6}
					/>

					<div styleName="captcha">
						<div className="g-recaptcha" data-sitekey="6Lel8U8UAAAAAPZlTTEo6LRv2H59m-uNcuJQudAX"></div>
					</div>

					<Button variant="contained" color="primary" styleName="submit" onClick={() => this.sendFeedback()}>
						Send
					</Button>
				</form>
			</div>
		)
	}
}