import React from 'react'
import styles from './styles.scss'
import css from 'react-css-modules'
import CircularProgress from '@material-ui/core/CircularProgress'


function Loading(props) {

	console.log(`Loading #${props.id}`)

	return (
		<div styleName="applicationLoader">
			<CircularProgress size={50} />
		</div>
	)
}

let com: any = css(styles)(Loading)

export default com