import React, { useState, useEffect, useRef } from 'react'
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

function Register(props) {

	const [busy, setBusy] = useState(false)
	const [enableGoogleOAuth, setEnableGoogleOAuth] = useState(false)
	const [enableFacebookOAuth, setEnableFacebookOAuth] = useState(false)

	const googleOAuth = useRef(null)
	const facebookOAuth = useRef(null)


	useEffect(() => {
		const script = document.createElement('script')
		script.src = 'https://www.google.com/recaptcha/api.js'
		script.async = true
		document.head.appendChild(script)

		if (!(window as any).gapi) {
			const script = document.createElement('script')
			script.src = 'https://apis.google.com/js/platform.js'
			script.async = true
			document.head.appendChild(script)
			script.onload = function() {
				(window as any).gapi.load('auth2', _ => {

					const auth2 = (window as any).gapi.auth2.init({
						client_id: '300208123830-vhj94eso4u0uv1nk6mo3o73j3im7pvv1.apps.googleusercontent.com'
					})
		
					auth2.attachClickHandler(googleOAuth.current, {}, onGoogleRegister, error => OAuthFailed(error, 'google'))
					setEnableGoogleOAuth(true)
		
				})
			}
		}

		if (!(window as any).FB) {
			const script = document.createElement('script')
			script.src = "https://connect.facebook.net/en_US/sdk.js"
			script.async = true
			document.head.appendChild(script)
			script.onload = function() {
				;(window as any).FB.init({
					appId: '261251371039658',
					cookie: true,  // enable cookies to allow the server to access 
					// the session
					xfbml: true,  // parse social plugins on this page
					version: 'v2.8' // use graph api version 2.8
				})
	
				setEnableFacebookOAuth(true)
			}
		}

		return () => clearForm()
	}, [])

	async function onGoogleRegister(user) {
		const id = user.getAuthResponse().id_token

		setBusy(true)
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

			handleChange('oauth', true)
			handleChange('oauthtoken', id)
			handleChange('oauthprovider', 'google')

			if (name) {
				handleChange('name', name)
				//this.handleChange('')
			}
			if (email) {
				handleChange('email', email)
				handleChange('oauthEmailFreeze', true)
			}
			//debugger
			props.infoNotification("Got it! Please fill other required details")
		} else {
			props.warningNotification("Hey! You already have an account. Loggin in..")

			props.userLoggedIn({
				username: data.loginWithOAuth.username,
				name: data.loginWithOAuth.name,
				email: data.loginWithOAuth.email
			})
		}

		setBusy(false)
	}

	function OAuthFailed(error, provider) {
		if (provider === 'google') {
			props.errorNotification("Error logging you in! Error message: " + error.error)
		}

		console.error('OAuth failed', error, provider)
	}

	/*componentDidUpdate() {
		const script = document.createElement('script')
		script.src = 'https://www.google.com/recaptcha/api.js'
		script.async = true
		document.head.appendChild(script)
	}*/

	function clearForm() {
		props.clearRegForm()
	}

	async function registerUser() {
		setBusy(true)

		let query, variables

		const { name, username, email, password, cpassword, oauthtoken: id, oauthprovider } = props
		const captcha = (document.querySelector(`[name='g-recaptcha-response']`) as HTMLInputElement || { value: null }).value

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
			props.errorNotification(data.result.error)
		} else {
			clearForm()
			props.successNotification("Welcome aboard!")

			props.userLoggedIn(data.result.data)
		}

		setBusy(false)
	}

	function handleChange(key, value) {
		props.setKeyValueRegister({ key, value })
	}

	async function onFacebookLogin(response) {
		if (response.status === 'connected') {

			setBusy(true)

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
				(window as any).FB.api('/me?fields=id,name,email', rep2 => {
					const { name, email } = rep2

					handleChange('oauth', true)
					handleChange('oauthtoken', response.authResponse.accessToken)
					handleChange('oauthprovider', 'facebook')

					if (name) {
						handleChange('name', name)
						//this.handleChange('')
					}
					if (email) {
						handleChange('email', email)
						handleChange('oauthEmailFreeze', true)
					}

					props.infoNotification("Got it! Please fill other required details")

					setBusy(false)
				})
			} else {

				props.warningNotification("Hey! You already have an account. Loggin in..")
				props.userLoggedIn(data.loginWithOAuth)
				setBusy(false)
			}
		} else {
			console.error(response)
			props.errorNotification("Error logging in with Facebook")
		}
	}

	if (busy) return <Loading />

	const { name, username, email, password, cpassword, oauthEmailFreeze, oauth } = props

	return (
		<div styleName={`register-form ${oauth ? 'oauth' : ''}`}>
			<h1 styleName="heading">Register Account</h1>
			{!!oauth || <h1 styleName="heading2">Have a Google/Facebook Account?</h1>}

			<TextField
				styleName="name"
				variant="outlined"
				label="Name"
				fullWidth
				value={name}
				onChange={e => handleChange('name', e.target.value)}
				margin="normal"
			/>

			<TextField
				styleName="username"
				variant="outlined"
				label="Username"
				fullWidth
				value={username}
				onChange={e => handleChange('username', e.target.value)}
				margin="normal"
			/>

			<TextField
				styleName="email"
				variant="outlined"
				label="Email"
				fullWidth
				disabled={oauthEmailFreeze}
				value={email}
				onChange={e => handleChange('email', e.target.value)}
				margin="normal"
			/>

			{!!oauth || <>
				<TextField
					styleName="password"
					label="Password"
					variant="outlined"
					type="password"
					fullWidth
					value={password}
					onChange={e => handleChange('password', e.target.value)}
					margin="normal"
				/>

				<TextField
					styleName="cpassword"
					label="Confirm Password"
					type="password"
					variant="outlined"
					fullWidth
					value={cpassword}
					onChange={e => handleChange('cpassword', e.target.value)}
					margin="normal"
				/>

				<div styleName="captcha">
					<div className="g-recaptcha" data-sitekey="6Lel8U8UAAAAAPZlTTEo6LRv2H59m-uNcuJQudAX"></div>
				</div>
			</>
			}

			<Button fullWidth variant="contained" color="primary" styleName="submit" onClick={registerUser}>
				Register
			</Button>

			<Divider styleName="divider" />

			<div styleName="register">
				<p>By signing up you agree to codedamn's <Link to={'/terms-of-service'}>Terms of Service.</Link></p>
				Already have an account? <Link to={"/login"}>Login</Link>
			</div>

			{!!oauth || <div styleName="social-register">
				<Button color="primary" disabled={!enableGoogleOAuth} buttonRef={googleOAuth} variant="contained" size="large">
					<img src="/assets/images/png/google.png" styleName="icon" />
					Register with Google
			</Button>

				<Button color="primary" disabled={!enableFacebookOAuth} buttonRef={facebookOAuth} onClick={_ => (window as any).FB.login(onFacebookLogin, { scope: 'public_profile,email' })} variant="contained" size="large">
					<img src="/assets/images/png/facebook.png" styleName="icon" />
					Register with Facebook
			</Button>
			</div>}
		</div>
	)
}

let com = css(styles, { handleNotFoundStyleName: 'log', allowMultiple: true })(Register)
com = Component({ title: 'Register', gridClass: styles.grid })(com)
com = connect(mapStateToProps, { setKeyValueRegister, warningNotification, successNotification, errorNotification, infoNotification, userLoggedIn, clearRegForm })(com)
com = withRouter(com)

export default com