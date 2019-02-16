import React from 'react'
import Loading from 'components/Loading'
import { withRouter, Link } from 'react-router-dom'
import { setKeyValueRegister } from 'reducers/system/actions'
import styles from './styles.scss'
import css from 'react-css-modules'
import axios from 'axios'
import { userLoggedIn, clearRegForm } from 'reducers/system/actions'
import { connect } from 'react-redux'
import { warningNotification, errorNotification, successNotification, infoNotification } from 'reducers/notifizer/actions'
import Component from 'decorators/Component'
import { Divider, Button, TextField } from '@material-ui/core'
import { GRAPHQL } from 'components/globals'

// TODO: Clean this up
const mapStateToProps = ({ system: { userLoggedIn, register: regsystem } }, { location: { search } }) => {
	let query = {}
	if (search) {
		// present
		const pairs = (search[0] === '?' ? search.substr(1) : search).split('&')
		for (let i = 0; i < pairs.length; i++) {
			const pair = pairs[i].split('=');
			query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
		}
	}
	return {
		name: regsystem.name || "",
		username: regsystem.username || "",
		email: regsystem.email || "",
		password: regsystem.password || "",
		cpassword: regsystem.cpassword || "",
		oauthEmailFreeze: regsystem.oauthEmailFreeze,
		oauth: regsystem.oauth,
		oauthtoken: regsystem.oauthtoken,
		isUserLoggedIn: userLoggedIn,
		oauthprovider: regsystem.oauthprovider,
		search,
		redirectInfo: query
	}
}

@withRouter
@connect(mapStateToProps, { setKeyValueRegister, warningNotification, successNotification, errorNotification, infoNotification, userLoggedIn, clearRegForm })
@Component({ title: 'Register', gridClass: styles.grid })
@css(styles, { handleNotFoundStyleName: 'log', allowMultiple: true })
export default class Register extends React.Component {

	state = { showLoader: false, enableGoogleOAuth: false, enableFacebookOAuth: false }

	componentWillReceiveProps(nextProps) {
		if (nextProps.isUserLoggedIn) {
			this.props.history.push('/panel')
		}
	}

	componentDidMount() {
		const script = document.createElement('script')
		script.src = 'https://www.google.com/recaptcha/api.js'
		script.async = true
		document.head.appendChild(script)

		if (!window.gapi) {
			const script = document.createElement('script')
			script.src = 'https://apis.google.com/js/platform.js'
			script.async = true
			document.head.appendChild(script)
		}

		if (!window.FB) {
			const script = document.createElement('script')
			script.src = "https://connect.facebook.net/en_US/sdk.js"
			script.async = true
			document.head.appendChild(script)
		}


		this.intv = setInterval(() => {
			if (!window.gapi) return
			clearInterval(this.intv)
			this.onGoogleSignupPress()
		}, 200)

		this.intv2 = setInterval(() => {
			if (!window.FB) return
			clearInterval(this.intv2)
			FB.init({
				appId: '261251371039658',
				cookie: true,  // enable cookies to allow the server to access 
				// the session
				xfbml: true,  // parse social plugins on this page
				version: 'v2.8' // use graph api version 2.8
			})

			this.setState({ enableFacebookOAuth: true })
		}, 200)
	}

	onGoogleSignupPress() {
		gapi.load('auth2', _ => {

			const auth2 = gapi.auth2.init({
				client_id: '300208123830-vhj94eso4u0uv1nk6mo3o73j3im7pvv1.apps.googleusercontent.com'
			})

			auth2.attachClickHandler(this.googleOAuth, {}, user => this.onGoogleRegister(user), error => this.OAuthFailed(error, 'google'))
			this.setState({ enableGoogleOAuth: true })

		})
	}

	componentWillUnmount() {
		this.clearForm()
		clearInterval(this.intv)
		clearInterval(this.intv2)
	}


	async onGoogleRegister(user) {
		const id = user.getAuthResponse().id_token

		this.setState({ showLoader: true })
		const { data: { data } } = await axios.post(GRAPHQL, {
			query: `query($id: String!) {
				loginWithOAuth(oauthprovider: "google", id: $id) {
					name
					username
					email
				}
			}`,
			variables: {
				id
			}
		})

		if (!data.loginWithOAuth) { // account not found
			const profile = user.getBasicProfile()
			const name = profile.getName()
			const email = profile.getEmail()

			this.handleChange('oauth', true)
			this.handleChange('oauthtoken', id)
			this.handleChange('oauthprovider', 'google')

			if (name) {
				this.handleChange('name', name)
				//this.handleChange('')
			}
			if (email) {
				this.handleChange('email', email)
				this.handleChange('oauthEmailFreeze', true)
			}
			//debugger
			this.props.infoNotification("Got it! Please fill other required details")
		} else {
			this.props.warningNotification("Hey! You already have an account. Loggin in..")

			this.props.userLoggedIn({
				username: data.loginWithOAuth.username,
				name: data.loginWithOAuth.name,
				email: data.loginWithOAuth.email
			})
		}

		this.setState({ showLoader: false })
	}

	OAuthFailed(error, provider) {
		if (provider === 'google') {
			this.props.errorNotification("Error logging you in! Error message: " + error.error)
		}

		console.error('OAuth failed', error, provider)
	}

	componentDidUpdate() {
		const script = document.createElement('script')
		script.src = 'https://www.google.com/recaptcha/api.js'
		script.async = true
		document.head.appendChild(script)
	}

	clearForm() {
		this.props.clearRegForm()
	}

	async registerUser() {
		this.setState({ showLoader: true })

		let query, variables

		const { name, username, email, password, cpassword, oauthtoken: id, oauthprovider } = this.props
		const captcha = (document.querySelector(`[name='g-recaptcha-response']`) || {}).value

		if (id) {
			// oauth registration
			query = `mutation($id: String!, $name: String!, $username: String!, $email: String!, $oauthprovider: String!) {
				result: registerWithOAuth(id: $id, name: $name, username: $username, email: $email, oauthprovider: $oauthprovider) {
					error
					data {
						name
						username
						email
					}
				}
			}`
			variables = {
				name, username, email, id, oauthprovider
			}
		} else {
			// normal registration
			query = `mutation($name: String!, $username: String!, $email: String!, $password: String!, $cpassword: String!, $captcha: String!) {
				result: registerWithoutOAuth(name: $name, username: $username, email: $email, password: $password, cpassword: $cpassword, captcha: $captcha) {
					error
					data {
						name
						username
						email
					}
				}
			}`
			variables = {
				name, username, email, password, cpassword, captcha
			}
		}

		const { data: { data } } = await axios.post(GRAPHQL, {
			query, variables
		})

		if (data.result.error) {
			this.props.errorNotification(data.result.error)
		} else {
			this.clearForm()
			this.props.successNotification("Welcome aboard!")

			this.props.userLoggedIn(data.result.data)
		}

		this.setState({ showLoader: false })
	}

	handleChange(key, value) {
		this.props.setKeyValueRegister({ key, value })
	}

	async onFacebookLogin(response) {
		if (response.status === 'connected') {

			this.setState({ showLoader: true })

			const { data: { data } } = await axios.post(GRAPHQL, {
				query: `query($id: String!) {
					loginWithOAuth(oauthprovider: "facebook", id: $id) {
						name
						username
						email
					}
				}`,
				variables: {
					id: response.authResponse.accessToken
				}
			})

			if (!data.loginWithOAuth) { // account not found
				FB.api('/me?fields=id,name,email', rep2 => {
					const { name, email } = rep2

					this.handleChange('oauth', true)
					this.handleChange('oauthtoken', response.authResponse.accessToken)
					this.handleChange('oauthprovider', 'facebook')

					if (name) {
						this.handleChange('name', name)
						//this.handleChange('')
					}
					if (email) {
						this.handleChange('email', email)
						this.handleChange('oauthEmailFreeze', true)
					}

					this.props.infoNotification("Got it! Please fill other required details")

					this.setState({ showLoader: false })
				})
			} else {

				this.props.warningNotification("Hey! You already have an account. Loggin in..")
				this.props.userLoggedIn(data.loginWithOAuth)
				this.setState({ showLoader: false })
			}
		} else {
			console.error(response)
			this.props.errorNotification("Error logging in with Facebook")
		}
	}

	render() {
		if (this.state.showLoader) return <Loading />

		const { name, username, email, password, cpassword, oauthEmailFreeze, oauth } = this.props

		return (
			<div styleName={`register-form ${oauth ? 'oauth' : ''}`}>
				<h1 styleName="heading">Register Account</h1>
				{!!oauth || <h1 styleName="heading2">Have a Google/Facebook Account?</h1>}

				<TextField
					id="something4"
					styleName="name"
					variant="outlined"
					label="Name"
					fullWidth
					value={name}
					onChange={e => this.handleChange('name', e.target.value)}
					margin="normal"
				/>

				<TextField
					id="something5"
					styleName="username"
					variant="outlined"
					label="Username"
					fullWidth
					value={username}
					onChange={e => this.handleChange('username', e.target.value)}
					margin="normal"
				/>

				<TextField
					id="something6"
					styleName="email"
					variant="outlined"
					label="Email"
					fullWidth
					disabled={oauthEmailFreeze}
					value={email}
					onChange={e => this.handleChange('email', e.target.value)}
					margin="normal"
				/>

				{!!oauth || <>
					<TextField
						id="something7"
						styleName="password"
						label="Password"
						variant="outlined"
						type="password"
						fullWidth
						value={password}
						onChange={e => this.handleChange('password', e.target.value)}
						margin="normal"
					/>

					<TextField
						id="somethin8"
						styleName="cpassword"
						label="Confirm Password"
						type="password"
						variant="outlined"
						fullWidth
						value={cpassword}
						onChange={e => this.handleChange('cpassword', e.target.value)}
						margin="normal"
					/>

					<div styleName="captcha">
						<div className="g-recaptcha" data-sitekey="6Lel8U8UAAAAAPZlTTEo6LRv2H59m-uNcuJQudAX"></div>
					</div>
				</>
				}

				<Button fullWidth variant="contained" color="primary" styleName="submit" onClick={() => this.registerUser()}>
					Register
				</Button>

				<Divider styleName="divider" />

				<div styleName="register">
					<p>By signing up you agree to codedamn's <Link to={'/terms-of-service'}>Terms of Service.</Link></p>
					Already have an account? <Link to={"/login"}>Login</Link>
				</div>

				{!!oauth || <div styleName="social-register">
					<Button color="primary" disabled={!this.state.enableGoogleOAuth} buttonRef={ref => this.googleOAuth = ref} variant="contained" size="large">
						<img src="/assets/images/png/google.png" styleName="icon" />
						Register with Google
				</Button>

					<Button color="primary" disabled={!this.state.enableFacebookOAuth} buttonRef={ref => this.facebookOAuth = ref} onClick={_ => window.FB.login(this.onFacebookLogin.bind(this), { scope: 'public_profile,email' })} variant="contained" size="large">
						<img src="/assets/images/png/facebook.png" styleName="icon" />
						Register with Facebook
				</Button>
				</div>}
			</div>
		)
	}
}