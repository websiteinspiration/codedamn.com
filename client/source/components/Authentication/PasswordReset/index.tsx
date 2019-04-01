import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { successNotification, errorNotification } from 'reducers/notifizer/actions'
import { TextField, Button } from '@material-ui/core'
import axios from 'axios'
import css from 'react-css-modules'
import styles from './styles.scss'


function PasswordReset(props) {

	const [email, setEmail] = useState('')

	useEffect(() => {
		const script = document.createElement('script')
		script.src = 'https://www.google.com/recaptcha/api.js'
		script.async = true
		document.head.appendChild(script)
	}, [])


	async function resetPass() {
		const { successNotification, errorNotification } = props
		const { data } = await axios.post('/password-reset', { email, 'g-recaptcha-response': (document.querySelector(`[name='g-recaptcha-response']`) as HTMLInputElement).value })

		if (data.status == "ok") {
			successNotification("Your password has been reset! Check your inbox")
			//alert('Password reset successful. Check your inbox')
		} else {
			errorNotification(data.data)
		}
	}

	return (
		<form styleName="reset" onSubmit={e => { e.preventDefault(); resetPass() }} name="contact_form">
			<h1 styleName="heading">Reset Password</h1>
			<TextField
				id="something3"
				styleName="email"
				label="Your Email ID"
				value={email}
				onChange={e => setEmail(e.target.value)}
				margin="normal"
			/>
			<div styleName="captcha">
				<div className="g-recaptcha" data-sitekey="6Lel8U8UAAAAAPZlTTEo6LRv2H59m-uNcuJQudAX"></div>
			</div>
			<Button type="submit" variant="contained" color="primary" styleName="submit">
				Reset Password
			</Button>
		</form>
	)
}

let com = css(styles)(PasswordReset)
com = connect(null, { successNotification, errorNotification })(com)

export default com