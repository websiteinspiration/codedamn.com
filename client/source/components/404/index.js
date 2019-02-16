import React from 'react'
import styles from './styles.scss'
import css from 'react-css-modules'
import { Link } from 'react-router-dom'
@css(styles)
export default class Four04 extends React.Component {
	render() {
		return (
			<div styleName="four04">404 Not Found |&nbsp;<Link to={'/'}>Go Home</Link></div>
		)
	}
}

