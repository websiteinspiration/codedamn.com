import React, { useState, useEffect } from 'react'
import styles from './styles.scss'
import css from 'react-css-modules'
import { Button, TextField } from '@material-ui/core'
import axios from 'axios'
import { successNotification, errorNotification } from 'reducers/notifizer/actions'
import { connect } from 'react-redux'

function Feedback(props) {

	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [message, setMessage] = useState('')

	useEffect(() => {
		const script = document.createElement('script')
		script.src = 'https://www.google.com/recaptcha/api.js'
		script.async = true
		document.head.appendChild(script)
	}, [])

	async function sendFeedback() {
		const { successNotification, errorNotification } = props
		const captcha = (document.querySelector(`[name='g-recaptcha-response']`) as HTMLInputElement).value

		const { data } = await axios.post('/send-feedback', { name, email, message, captcha })
		if (data.status == "ok") {
			successNotification('Your message is received! We\'ll get back to you soon!')
		} else {
			errorNotification('There were some errors sending your feedback. Try again?')
		}
	}

	return (
		<div styleName="n60 feedbackParent">
			<h1>Welcome to codedamn</h1>
			<p>Thank you so much for making it so far! codedamn aims to bring value to developers all around the globe and connect them with appropirate communities. This platform is being actively developed and worked upon. <b>There are bugs, glitches, vulnerabilties, holes, broken elements, wrong resolutions, incorrect content, bad code, and WHAT NOT!</b> We understand all of that and want YOU to be a part of the team. Send a bug report or anything which annoys you using the form below. Since it's a feedback form, you can also praise us a little if you want ;)</p>
			<form styleName="container" onSubmit={e => { e.preventDefault() }}>

				<TextField
					styleName="name"
					label="Name"
					variant="outlined"
					value={name}
					onChange={e => setName(e.target.value)}
					margin="normal"
				/>

				<TextField
					styleName="email"
					label="Email"
					variant="outlined"
					value={email}
					onChange={e => setEmail( e.target.value)}
					margin="normal"
				/>

				<TextField
					styleName="message"
					label="Message"
					variant="outlined"
					value={message}
					onChange={e => setMessage(e.target.value)}
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

let com = css(styles, { handleNotFoundStyleName: 'log', allowMultiple: true })(Feedback)
com = connect(null, { successNotification, errorNotification })(com)

export default com