import React from 'react'
import { connect } from 'react-redux'
import styles from './styles.scss'
import { hideNotifizer } from 'reducers/notifizer/actions'
import css from 'react-css-modules'
import { CheckCircle as CheckCircleIcon, Error as ErrorIcon, Info as InfoIcon, Close as CloseIcon, Warning as WarningIcon } from '@material-ui/icons'
import { IconButton, Snackbar, SnackbarContent } from '@material-ui/core'

const mapStateToProps = ({notifizer}) => ({
	message: notifizer.message,
	visible: notifizer.visible,
	type: notifizer.type,
	delay: notifizer.delay
})

console.log({
	IconButton, Snackbar, SnackbarContent,
	CheckCircleIcon, ErrorIcon, InfoIcon, CloseIcon, WarningIcon
})

function Notifizer(props) {

	function handleClose(reason) {
		if (reason === 'clickaway') {
			return
		}
		props.hideNotifizer()
	}

	const { message, type, visible, delay } = props

	const variantIcon = {
		success: CheckCircleIcon,
		warning: WarningIcon,
		error: ErrorIcon,
		info: InfoIcon,
	}

	const Icon = variantIcon[type || 'success']

	return (
		<Snackbar
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'left',
			}}
			open={visible}
			autoHideDuration={delay || 7000}
			onClose={(_, reason) => handleClose(reason)}
			>

			<SnackbarContent
				styleName={type}
				aria-describedby="client-snackbar"
				message={
					<span id="client-snackbar" styleName="message">
					<Icon styleName="icon iconVariant" />
					{message}
					</span>
				}
				action={[
					<IconButton
					key="close"
					aria-label="Close"
					color="inherit"
					styleName="close"
					onClick={e => handleClose(null)}
					>
					<CloseIcon styleName="icon" />
					</IconButton>,
				]}
			/>
		</Snackbar>
	)
}


let com: any = css(styles, { handleNotFoundStyleName: 'log', allowMultiple: true })(Notifizer)
com = connect(mapStateToProps, { hideNotifizer })(com)

export default com