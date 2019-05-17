import React, { useEffect, Suspense } from 'react'
import asyncComponent from 'components/AsyncComponent'
import Header from 'components/Header'
import Footer from 'components/Footer'
const Home = React.lazy(() => import('components/Home'))
const Login = React.lazy(() => import('components/Authentication/Login'))
const Logout = React.lazy(() => import('components/Authentication/Logout'))
const Register = React.lazy(() => import('components/Authentication/Register'))
const PasswordReset = React.lazy(() => import('components/Authentication/PasswordReset'))
const Panel = React.lazy(() => import('components/Panel'))
const Feedback = React.lazy(() => import('components/Feedback'))
const LearningGround = React.lazy(() => import('components/LearningGround'))
const Settings = React.lazy(() => import('components/Settings'))
const Visualizer = React.lazy(() => import('components/Visualizer'))
const Four04 = React.lazy(() => import('components/404'))
const About = React.lazy(() => import('components/About'))
const DamnTable = React.lazy(() => import('components/DamnTable'))
const PrivacyPolicy = React.lazy(() => import('components/PrivacyPolicy'))
const TermsOfService = React.lazy(() => import('components/TermsOfService'))
const PracticeGround = React.lazy(() => import('components/PracticeGround'))
const Tasker = React.lazy(() => import('components/PracticeGround/Tasker'))
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
						<Route path="/learn/:slug" exact component={Visualizer} />
						<Route path="/learn/:parentslug/:dotslug" exact component={LearningGround} />
						<Route path="/practice/:moduleid/:challengeid" exact component={Tasker} />
						<Route path="/practice/:moduleid" exact component={PracticeGround} />
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

let com: any = css(styles)(App)
com = connect(mapStateToProps, { checkForUpdates })(com)

export default com