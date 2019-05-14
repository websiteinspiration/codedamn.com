import React from 'react'
import styles from './styles.scss'
import css from 'react-css-modules'
import CircularProgress from '@material-ui/core/CircularProgress'

const material = theme => ({
	progress: {
	  margin: theme.spacing.unit * 2,
	},
})


function Loading(props) {
	const { classes } = props
	return (
		<div styleName="applicationLoader">
			<CircularProgress size={50} />
		</div>
	)
}

let com: any = css(styles)(Loading)

export default com