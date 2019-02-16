import React from 'react'
import { connect } from 'react-redux'
import { successNotification, errorNotification } from 'reducers/notifizer/actions'
import { TextField, Button } from '@material-ui/core'
import axios from 'axios'
import css from 'react-css-modules'
import styles from './styles.scss'

@connect(null, { successNotification, errorNotification })
@css(styles)
export default class PasswordReset extends React.Component {

	state = { email: "" }

	componentDidMount() {
		const script = document.createElement('script')
		script.src = 'https://www.google.com/recaptcha/api.js'
		script.async = true
		document.head.appendChild(script)
	}

	async resetPass() {
		const { successNotification, errorNotification } = this.props
		const { data } = await axios.post('/password-reset', { email: this.state.email, 'g-recaptcha-response': document.querySelector(`[name='g-recaptcha-response']`).value })

		if (data.status == "ok") {
			successNotification("Your password has been reset! Check your inbox")
			//alert('Password reset successful. Check your inbox')
		} else {
			errorNotification(data.data)
		}
	}

	render() {
		return (
			<form styleName="reset" onSubmit={e => { e.preventDefault(); this.resetPass() }} name="contact_form">
				<h1 styleName="heading">Reset Password</h1>
				<TextField
					id="something3"
					styleName="email"
					label="Your Email ID"
					value={this.state.email}
					onChange={e => this.setState({ email: e.target.value })}
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
}