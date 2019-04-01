import React, { useEffect, Suspense } from 'react'
import asyncComponent from 'components/AsyncComponent'
import Header from 'components/Header'
import Footer from 'components/Footer'
const Home = React.lazy(() => import('components/Home' /* webpackChunkName: "Home" */))
const Login = React.lazy(() => import('components/Authentication/Login' /* webpackChunkName: "Login" */))
const Logout = React.lazy(() => import('components/Authentication/Logout' /* webpackChunkName: "Logout" */))
const Register = React.lazy(() => import('components/Authentication/Register' /* webpackChunkName: "Register" */))
const PasswordReset = React.lazy(() => import('components/Authentication/PasswordReset' /* webpackChunkName: "Password Reset" */))
const Panel = React.lazy(() => import('components/Panel' /* webpackChunkName: "Panel" */))
const Feedback = React.lazy(() => import('components/Feedback' /* webpackChunkName: "Feedback" */))
const Settings = React.lazy(() => import('components/Settings' /* webpackChunkName: "Settings" */))
const Four04 = React.lazy(() => import('components/404' /* webpackChunkName: "404" */))
const About = React.lazy(() => import('components/About' /* webpackChunkName: "About" */))
const DamnTable = React.lazy(() => import('components/DamnTable' /* webpackChunkName: "DamnTable" */))
const PrivacyPolicy = React.lazy(() => import('components/PrivacyPolicy' /* webpackChunkName: "Privacy Policy" */))
const TermsOfService = React.lazy(() => import('components/TermsOfService' /* webpackChunkName: "Terms of Service" */))
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { checkForUpdates } from 'reducers/system/actions'
import { ConnectedRouter } from "react-router-redux"
import Notifizer from 'components/Notifizer'
import styles from './globals.scss'
import css from 'react-css-modules'
import axios from 'axios'
import Loading from 'components/Loading'
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
const CustomRoute = ({ notification = undefined, render = undefined, component: Component = undefined, condition = undefined, otherwise = undefined, ...rest }) => {
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

function App(props) {


	useEffect(() => {
		props.checkForUpdates()
	}, [])


	return (<ConnectedRouter history={props.history}>
		<MuiThemeProvider theme={theme}>
			<Suspense fallback={<Loading />}>
			<div className="shareHeight">
				<Header />
				<div className="asyncComponent">
					<Switch>
						<CustomRoute path="/" condition={!props.userLoggedIn} otherwise={'/panel'} exact component={Home} />
						<CustomRoute path="/register" condition={!props.userLoggedIn} otherwise={'/panel'} exact component={Register} />
						<CustomRoute exact path="/login" condition={!props.userLoggedIn} otherwise={'/panel'} component={Login} />
						<CustomRoute path="/panel" exact component={Panel} condition={props.userLoggedIn} otherwise={'/login'} />
						<CustomRoute path="/settings" exact condition={props.userLoggedIn} otherwise={'/login'} component={Settings} />
						<Route path="/password-reset" exact component={PasswordReset} />
						<Route path="/feedback" exact component={Feedback} />
						<Route path="/about" exact component={About} />
						<Route path="/damn-table" exact component={DamnTable} />
						<Route path="/logout" condition={props.userLoggedIn} component={Logout} />
						<Route path="/privacy-policy" exact component={PrivacyPolicy} />
						<Route path="/terms-of-service" exact component={TermsOfService} />
						<Route component={Four04} />
					</Switch>
				</div>
			</div>
			<Footer />
			<Notifizer />
			</Suspense>
		</MuiThemeProvider>
	</ConnectedRouter>
	)
}

let com = css(styles)(App)
com = connect(mapStateToProps, { checkForUpdates })(com)

export default com