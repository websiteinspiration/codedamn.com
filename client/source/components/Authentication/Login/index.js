import React from 'react'
import Loading from '@components/Loading'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { userLoggedIn } from '@reducers/system/actions'
import styles from './styles.scss'
import css from 'react-css-modules'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import axios from 'axios'
import { errorNotification, infoNotification, successNotification } from '@reducers/notifizer/actions'
import { setKeyValueRegister } from '@reducers/system/actions'
import Component from '@decorators/Component'

import { GRAPHQL } from '@components/globals'

const mapStateToProps = ({system}, {location:{search}}) => {
	let query = {}
	if(search) {
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

@withRouter
@connect(mapStateToProps, { successNotification, userLoggedIn, errorNotification, infoNotification, setKeyValueRegister })
@Component({ gridClass: styles.grid, title: 'Login' })
@css(styles, { handleNotFoundStyleName: 'log' })
export default class Login extends React.Component {

	state = { busy: false, username: "", password: "" }

	componentDidMount() {
		if(!window.gapi) {
			const script = document.createElement('script')
			script.src = "https://apis.google.com/js/platform.js"
			script.async = true
			document.head.appendChild(script)
		}

		if(!window.FB) {
			const script = document.createElement('script')
			script.src = "https://connect.facebook.net/en_US/sdk.js"			
			script.async = true
			document.head.appendChild(script)
		}

		this.intv = setInterval(() => {
			if(!window.gapi) return
			clearInterval(this.intv)
			this.onGoogleSigninPress()
		}, 200)

		this.intv2 = setInterval(() => {
			if(!window.FB) return
			clearInterval(this.intv2)
			FB.init({
				appId      : '261251371039658',
				cookie     : true,  // enable cookies to allow the server to access 
									// the session
				xfbml      : true,  // parse social plugins on this page
				version    : 'v2.8' // use graph api version 2.8
			})

			this.setState({ enableFacebookOAuth: true })
		}, 200)
	}

	onGoogleSigninPress() {
		gapi.load('auth2', _ => {
			const auth2 = gapi.auth2.init({
				client_id: '300208123830-vhj94eso4u0uv1nk6mo3o73j3im7pvv1.apps.googleusercontent.com'
			})

			auth2.attachClickHandler(this.googleOAuth, {}, user => this.onGoogleLogin(user), error => this.OAuthFailed(error, 'google'))
			this.setState({ enableGoogleOAuth: true })
		})
	}

	OAuthFailed(error, provider) {
		if(provider === 'google') {
			this.props.errorNotification("Error logging you in! Error message: " + error.error)
		}

		console.error('OAuth failed', error, provider)
	}

	async onGoogleLogin(user) {
		const id = user.getAuthResponse().id_token

		this.setState({ busy: true })
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

		if(!data.loginWithOAuth) { // account not found
			const profile = user.getBasicProfile()
			const name = profile.getName()
			const email = profile.getEmail()

			this.handleRegistrationChange('oauth', true)
			this.handleRegistrationChange('oauthtoken', id)
			this.handleRegistrationChange('oauthprovider', 'google')

			if(name) {
				this.handleRegistrationChange('name', name)
				//this.handleChange('')
			}
			if(email) {
				this.handleRegistrationChange('email', email)
				this.handleRegistrationChange('oauthEmailFreeze', true)
			}
			//debugger
			this.props.infoNotification("It'll take a minute to get you on board. Hang on!")
			this.props.history.push({ pathname: "/register", search: this.props.search })

		} else {

			this.props.userLoggedIn(data.loginWithOAuth)
			this.setState({ busy: false })
		}
		
	}

	handleRegistrationChange(key, value) {
		this.props.setKeyValueRegister({ key, value })
	}

	async loginUser() {
		const { successNotification, errorNotification } = this.props
		const { username, password } = this.state

		this.setState({ busy: true }) //, async _ => {

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

			if(data.result) {
				successNotification("Hi "+data.result.name+"!")
				this.props.userLoggedIn(data.result)
			} else {
				errorNotification("Invalid login details")
			}
		} catch(e) {
			console.error(e)
			errorNotification('Unknown error logging you in')
		} finally {
			this.setState({ busy: false })
		}
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.isUserLoggedIn) {
			this.props.history.push('/panel')
		}
	}

	handleChange(key, value) {
		this.setState({ [key]: value })
	}

	async onFacebookLogin(response) {
		if(response.status === 'connected') {

			this.setState({ busy: true }) 

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

			if(!data.loginWithOAuth) { // account not found
				FB.api('/me?fields=id,name,email', rep2 => {
					const { name, email } = rep2

					this.handleRegistrationChange('oauth', true)
					this.handleRegistrationChange('oauthtoken', response.authResponse.accessToken)
					this.handleRegistrationChange('oauthprovider', 'facebook')

					if(name) {
						this.handleRegistrationChange('name', name)
						//this.handleChange('')
					}
					if(email) {
						this.handleRegistrationChange('email', email)
						this.handleRegistrationChange('oauthEmailFreeze', true)
					}

					this.props.infoNotification("It'll take a minute to get you on board. Hang on!")

					this.props.history.push({ pathname: "/register", search: this.props.search })
					this.setState({ busy: false })
				})
			} else {

				this.props.userLoggedIn(data.loginWithOAuth)
				this.setState({ busy: false })
				
			}
		} else {
			console.error(response)
			this.props.errorNotification("Error logging in with Facebook")
		}
	}

	render() {

		if(this.state.busy) return <Loading />

		return (
			<form styleName="login-form" onSubmit={ e => { e.preventDefault(); this.loginUser() } }>
				<h1 styleName="heading">Login to your account</h1>
				<TextField
					id="something2"
					
					styleName="username"
					label="Username/Email"
					variant="outlined"
					margin="auto"
					value={this.state.username}
					onChange={e => this.handleChange('username', e.target.value)}
					margin="normal"
				/>

				<TextField
					id="something1"
					
					styleName="password"
					label="Password"
					variant="outlined"
					margin="auto"
					type="password"
					value={this.state.password}
					onChange={e => this.handleChange('password', e.target.value)}
					margin="normal"
				/>

				<Button type="submit" variant="contained" color="primary" styleName="submit">
					Login
				</Button>

				<div styleName="forgot">
					<Link to={'/password-reset'}>Forgot password?</Link>
				</div>
				<div styleName="register">
					<Link to={{ pathname: "/register", search: this.props.search }}>Register an account</Link>
				</div>
				<div styleName="social-login">
					<Button color="primary" disabled={!this.state.enableGoogleOAuth} buttonRef={ref=> this.googleOAuth = ref} variant="contained" size="large">
							<img src="/assets/images/png/google.png" styleName="icon" />
							Sign In with Google
					</Button>

					<Button color="primary" onClick={_ => window.FB.login(this.onFacebookLogin.bind(this), { scope: 'public_profile,email' })} disabled={!this.state.enableFacebookOAuth} buttonRef={ref=> this.facebookOAuth = ref} variant="contained" size="large">
							<img src="/assets/images/png/facebook.png" styleName="icon" />
							Sign In with Facebook
					</Button>
				</div>
			</form>
		)
	}
}

