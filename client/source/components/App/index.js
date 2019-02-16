import React from 'react'
import asyncComponent from 'components/AsyncComponent'
import Header from 'components/Header'
import Footer from 'components/Footer'
const Home = asyncComponent(_ => import('components/Home' /* webpackChunkName: "Home" */).then(x => x.default))
const Login = asyncComponent(_ => import('components/Authentication/Login' /* webpackChunkName: "Login" */).then(x => x.default))
const Logout = asyncComponent(_ => import('components/Authentication/Logout' /* webpackChunkName: "Logout" */).then(x => x.default))
const Register = asyncComponent(_ => import('components/Authentication/Register' /* webpackChunkName: "Register" */).then(x => x.default))
const PasswordReset = asyncComponent(_ => import('components/Authentication/PasswordReset' /* webpackChunkName: "Password Reset" */).then(x => x.default))
const Panel = asyncComponent(_ => import('components/Panel' /* webpackChunkName: "Panel" */).then(x => x.default))
const Feedback = asyncComponent(_ => import('components/Feedback' /* webpackChunkName: "Feedback" */).then(x => x.default))
const Settings = asyncComponent(_ => import('components/Settings' /* webpackChunkName: "Settings" */).then(x => x.default))
const Four04 = asyncComponent(_ => import('components/404' /* webpackChunkName: "404" */).then(x => x.default))
const About = asyncComponent(_ => import('components/About' /* webpackChunkName: "About" */).then(x => x.default))
const DamnTable = asyncComponent(_ => import('components/DamnTable' /* webpackChunkName: "DamnTable" */).then(x => x.default))
const PrivacyPolicy = asyncComponent(_ => import('components/PrivacyPolicy' /* webpackChunkName: "Privacy Policy" */).then(x => x.default))
const TermsOfService = asyncComponent(_ => import('components/TermsOfService' /* webpackChunkName: "Terms of Service" */).then(x => x.default))
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { checkForUpdates } from 'reducers/system/actions'
import { ConnectedRouter } from "react-router-redux"
import Notifizer from 'components/Notifizer'
import styles from './globals.scss'
import css from 'react-css-modules'
import axios from 'axios'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

axios.defaults.headers.common = {
	'Content-Type': 'application/json',
}

axios.defaults.withCredentials = true

const theme = createMuiTheme({
	palette: {
		type: 'light', // Switching the dark mode on is a single property value change.
	}
})

/* test */
const CustomRoute = ({ notification, render, component: Component, condition, otherwise, ...rest }) => {
	return (<Route {...rest} render={props => {
		if (condition === undefined || condition === true) {
			return render || <Component {...props} /> // coz javascript
		}
		if (notification) {
			notification()
		}
		return <Redirect to={{ pathname: otherwise || "/404" }} />
	}
	} />)
}

const mapStateToProps = ({ system }) => ({
	userLoggedIn: system.userLoggedIn
})

@connect(mapStateToProps, { checkForUpdates })
@css(styles)
export default class App extends React.Component {

	state = {}

	componentDidMount() {
		this.props.checkForUpdates()
	}

	render() {

		return (<ConnectedRouter history={this.props.history}>
			<MuiThemeProvider theme={theme}>
				<div className="shareHeight">
					<Header />
					<div className="asyncComponent">
						<Switch>
							<CustomRoute path="/" condition={!this.props.userLoggedIn} otherwise={'/panel'} exact component={Home} />
							<CustomRoute path="/register" condition={!this.props.userLoggedIn} otherwise={'/panel'} exact component={Register} />
							<CustomRoute exact path="/login" condition={!this.props.userLoggedIn} otherwise={'/panel'} component={Login} />
							<CustomRoute path="/panel" exact component={Panel} condition={this.props.userLoggedIn} otherwise={'/login'} />
							<CustomRoute path="/settings" exact condition={this.props.userLoggedIn} otherwise={'/login'} component={Settings} />
							<Route path="/password-reset" exact component={PasswordReset} />
							<Route path="/feedback" exact component={Feedback} />
							<Route path="/about" exact component={About} />
							<Route path="/damn-table" exact component={DamnTable} />
							<Route path="/logout" condition={this.props.userLoggedIn} component={Logout} />
							<Route path="/privacy-policy" exact component={PrivacyPolicy} />
							<Route path="/terms-of-service" exact component={TermsOfService} />
							<Route component={Four04} />
						</Switch>
					</div>
				</div>
				<Footer />
				<Notifizer />
			</MuiThemeProvider>
		</ConnectedRouter>
		)
	}
}
