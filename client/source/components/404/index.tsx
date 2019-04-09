import React from 'react'
import styles from './styles.scss'
import css from 'react-css-modules'
import { Link } from 'react-router-dom'

function Four04() {

	return (
		<div styleName="four04">404 Not Found |&nbsp;<Link to={'/'}>Go Home</Link></div>
	)
}

export default css(styles)(Four04)