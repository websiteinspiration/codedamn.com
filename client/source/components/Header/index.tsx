import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import styles from './styles.scss'
import css from 'react-css-modules'
import Menu from '@material-ui/icons/Menu'

const mapStateToProps = ({system}) => ({
	userLoggedIn: system.userLoggedIn,
	user: system.user,
	headerType: system.headerType
})

let loggedInLinks = (
	<>
		<Link styleName='item' to={"/damn-table"}>Damn Table</Link>
		<Link styleName='item' to={"/settings"}>Settings</Link>
		<Link styleName='item' to={"/logout"}>Sign out</Link>
	</>
)

let loggedOutLinks = (
	<>
		<Link to={{pathname: "/login", search: window.location.search}} styleName='item'>Login</Link>
		<Link to={{pathname: "/register", search: window.location.search}} styleName='item signup-button'>Register</Link>
	</>
)

function Header(props) {

	const { userLoggedIn } = props
	const nav = userLoggedIn? loggedInLinks: loggedOutLinks

	return (
	<header styleName="main-navbar">
		<div styleName="logo">
			<Link to="/" styleName="image-text-pair">
				<img src={`/assets/images/red-logo.png`} />

				<div styleName="text">
					codedamn
				</div>
				</Link>
		</div>

		<div styleName="center-nav">
			<div styleName="navbar-left-links">
				<Link to="/about" styleName='item'>About us</Link>
				<Link to="/feedback" styleName='item'>Got feedback?</Link>
			</div>
		</div>

		<div styleName="navbar-right">
			{nav}
		</div>
	</header>
	)
}

let com = css(styles, { handleNotFoundStyleName: 'log', allowMultiple: true })(Header)
com = connect(mapStateToProps, {})(com)

export default com