import React, { useState, useEffect, useRef } from 'react'
import styles from './styles.scss'
import css from 'react-css-modules'
import { Button, TextField } from '@material-ui/core'
import axios from 'axios'
import { successNotification, errorNotification } from 'reducers/notifizer/actions'
import { connect } from 'react-redux'
import { GRAPHQL } from 'components/globals'
import Component from 'decorators/Component'

function Feedback(props) {

	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [message, setMessage] = useState('')

	//const input = useRef(null)

	useEffect(() => {
		const script = document.createElement('script')
		script.src = 'https://www.google.com/recaptcha/api.js'
		script.async = true
		document.head.appendChild(script)
	}, [])

	async function sendFeedback() {
		const { successNotification, errorNotification } = props
		const captcha = (document.querySelector(`[name='g-recaptcha-response']`) as HTMLInputElement).value

		try {
			const { data: { data } } = await axios.post(GRAPHQL, {
				query: `mutation($captcha: String!, $email: String!, $name: String!, $message: String!) {
					sendFeedback(name: $name, captcha: $captcha, email: $email, message: $message) {
						status
						data
					}
				}`,
				variables: {
					captcha, name, email, message
				}
			})

			const { status, data: error } = data.sendFeedback

			if (status == "ok") {
				successNotification('Your message is received! We\'ll get back to you soon!')
			} else {
				throw error
			}
		} catch(error) {
			console.error(error)
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

				<Button variant="contained" color="primary" styleName="submit" onClick={sendFeedback}>
					Send
				</Button>
			</form>
		</div>
	)
}

let com: any = css(styles, { handleNotFoundStyleName: 'log', allowMultiple: true })(Feedback)
com = Component({ title: 'Send Feedback' })(com)
com = connect(null, { successNotification, errorNotification })(com)

export default com