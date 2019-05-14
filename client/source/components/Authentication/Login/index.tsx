import React, { useState, useEffect, useRef } from 'react'
import Loading from 'components/Loading'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { userLoggedIn } from 'reducers/system/actions'
import styles from './styles.scss'
import css from 'react-css-modules'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import axios from 'axios'
import { errorNotification, infoNotification, successNotification } from 'reducers/notifizer/actions'
import { setKeyValueRegister } from 'reducers/system/actions'
import Component from 'decorators/Component'

import { GRAPHQL } from 'components/globals'

const mapStateToProps = ({ system }, { location: { search } }) => {
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
		isUserLoggedIn: system.userLoggedIn,
		redirectInfo: query,
		search
	}
}

function Login(props) {

	const [busy, setBusy] = useState(false)
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [enableGoogleOAuth, setEnableGoogleOAuth] = useState(true)
	const [enableFacebookOAuth, setEnableFacebookOAuth] = useState(true)

	const googleOAuth = useRef(null)
	const facebookOAuth = useRef(null)
	
	useEffect(() => {
		if (!(window as any).gapi) {
			const script = document.createElement('script')
			script.src = "https://apis.google.com/js/platform.js"
			script.async = true
			document.head.appendChild(script)
			script.onload = enableGoogleButton
		} else {
			enableGoogleButton()
		}

		if (!(window as any).FB) {
			setEnableFacebookOAuth(false)
			const script = document.createElement('script')
			script.src = "https://connect.facebook.net/en_US/sdk.js"
			script.async = true
			document.head.appendChild(script)
			script.onload = enableFacebookButton
		} else {
			enableFacebookButton()
		}
	}, [])

	function enableGoogleButton() {
		(window as any).gapi.load('auth2', _ => {
			const auth2 = (window as any).gapi.auth2.init({
				client_id: '300208123830-vhj94eso4u0uv1nk6mo3o73j3im7pvv1.apps.googleusercontent.com'
			})
			auth2.attachClickHandler(googleOAuth.current, {}, onGoogleLogin, error => OAuthFailed(error, 'google'))
			setEnableGoogleOAuth(true)
		})
	}

	function enableFacebookButton() {
		(window as any).FB.init({
			appId: '261251371039658',
			cookie: true, 
			xfbml: true, 
			version: 'v2.8'
		})

		setEnableFacebookOAuth(true)
	}


	function OAuthFailed(error, provider) {
		if (provider === 'google') {
			props.errorNotification("Error logging in with Google")
		} else if(provider === 'facebook') {
			props.errorNotification("Error logging in with Facebook")
		}

		console.error('OAuth failed', error, provider)
	}

	async function onGoogleLogin(user) {
		const id = user.getAuthResponse().id_token

		setBusy(true)

		const { data: { data } } = await axios.post(GRAPHQL, {
			query: `query($id: String!) {
				result: loginWithOAuth(oauthprovider: "google", id: $id) {
					name
					username
					email
				}
			}`,
			variables: {
				id
			}
		})

		if (!data.result) { // account not found
			const profile = user.getBasicProfile()
			const name = profile.getName()
			const email = profile.getEmail()

			handleRegistrationChange('oauth', true)
			handleRegistrationChange('oauthtoken', id)
			handleRegistrationChange('oauthprovider', 'google')

			if (name) {
				handleRegistrationChange('name', name)
				//this.handleChange('')
			}
			if (email) {
				handleRegistrationChange('email', email)
				handleRegistrationChange('oauthEmailFreeze', true)
			}
			//debugger
			props.infoNotification("It'll take a minute to get you on board. Hang on!")
			props.history.push({ pathname: "/register", search: props.search })

		} else {

			successNotification("Hi " + data.result.name + "!")
			props.userLoggedIn(data.result)
			setBusy(false)
		}

	}

	function handleRegistrationChange(key, value) {
		props.setKeyValueRegister({ key, value })
	}

	async function loginUser() {
		const { successNotification, errorNotification } = props

		setBusy(true)

		try {
			const { data: { data } } = await axios.post(GRAPHQL, {
				query: `query($username: String!, $password: String!) {
					result: loginWithUsernamePassword(username: $username, password: $password) {
						name
						username
						email
					}
				}`,
				variables: { username, password }
			})

			if (data.result) {
				successNotification("Hi " + data.result.name + "!")
				props.userLoggedIn(data.result)
			} else {
				errorNotification("Invalid login details")
			}
		} catch (e) {
			console.error(e)
			errorNotification('Unknown error logging you in')
		} finally {
			setBusy(false)
		}
	}

	function handleChange(key, value) {
		// this.setState({ [key]: value })
	}

	async function onFacebookLogin(response) {
		if (response.status === 'connected') {

			setBusy(true)

			const { data: { data } } = await axios.post(GRAPHQL, {
				query: `query($id: String!) {
					result: loginWithOAuth(oauthprovider: "facebook", id: $id) {
						name
						username
						email
					}
				}`,
				variables: {
					id: response.authResponse.accessToken
				}
			})

			if (!data.result) { // account not found
				(window as any).FB.api('/me?fields=id,name,email', rep2 => {
					const { name, email } = rep2

					handleRegistrationChange('oauth', true)
					handleRegistrationChange('oauthtoken', response.authResponse.accessToken)
					handleRegistrationChange('oauthprovider', 'facebook')

					if (name) {
						handleRegistrationChange('name', name)
						//this.handleChange('')
					}
					if (email) {
						handleRegistrationChange('email', email)
						handleRegistrationChange('oauthEmailFreeze', true)
					}

					props.infoNotification("It'll take a minute to get you on board. Hang on!")

					props.history.push({ pathname: "/register", search: props.search })
					setBusy(false)
				})
			} else {

				successNotification("Hi " + data.result.name + "!")
				props.userLoggedIn(data.result)
				setBusy(false)

			}
		} else {
			OAuthFailed(response, "facebook")
		}
	}


	if (busy) return <Loading />

	return (
		<form styleName="login-form" onSubmit={e => { e.preventDefault(); loginUser() }}>
			<h1 styleName="heading">Login to your account</h1>
			<TextField
				styleName="username"
				label="Username/Email"
				variant="outlined"
				margin="normal"
				value={username}
				onChange={e => setUsername(e.target.value)}
			/>

			<TextField
				styleName="password"
				label="Password"
				variant="outlined"
				margin="normal"
				type="password"
				value={password}
				onChange={e => setPassword(e.target.value)}
			/>

			<Button type="submit" variant="contained" color="primary" styleName="submit">
				Login
			</Button>

			<div styleName="forgot">
				<Link to={'/password-reset'}>Forgot password?</Link>
			</div>
			<div styleName="register">
				<Link to={{ pathname: "/register", search: props.search }}>Register an account</Link>
			</div>
			<div styleName="social-login">
				<Button color="primary" disabled={!enableGoogleOAuth} buttonRef={googleOAuth} variant="contained" size="large">
					<img src="/assets/images/png/google.png" styleName="icon" />
					Sign In with Google
				</Button>

				<Button color="primary" onClick={_ => (window as any).FB.login(response => onFacebookLogin(response), { scope: 'public_profile,email' })} disabled={!enableFacebookOAuth} buttonRef={facebookOAuth} variant="contained" size="large">
					<img src="/assets/images/png/facebook.png" styleName="icon" />
					Sign In with Facebook
				</Button>
			</div>
		</form>
	)
}

let com: any = css(styles, { handleNotFoundStyleName: 'log' })(Login)
com = Component({ gridClass: styles.grid, title: 'Login' })(com)
com = connect(mapStateToProps, { successNotification, userLoggedIn, errorNotification, infoNotification, setKeyValueRegister })(com)
com = withRouter(com)

export default com