import React, { useState, useEffect } from 'react'
import styles from './styles.scss'
import css from 'react-css-modules'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import LinearProgress from '@material-ui/core/LinearProgress'
import { CheckCircle, Close, PlayArrow } from '@material-ui/icons'

const mapStateToProps = ({ learn }) => ({
	nextTitle: learn.dotInfo.nextTitle,
	nextURL: learn.dotInfo.nextURL
})


function Task(props) {

	let timer
	const [progressBar, setProgressBar] = useState(0)
	const [overlay, setOverlay] = useState(false)
	const host = window.location.hostname === "localhost" ? "http://localhost:1339" : "https://do.codedamn.com"

	useEffect(() => {
		window.addEventListener('message', handleMessage)
		return () => {
			window.removeEventListener('message', handleMessage)
			clearInterval(timer)
		}
	}, [])

	function handleMessage(e) {
		const message = e.data || e.message
		if(message === 'completed') {
			setOverlay(true)
			clearInterval(timer)
			timer = setInterval(() => {
				if(progressBar >= 101) {
					clearInterval(timer)
					return goToNext()
				}
				setProgressBar(progressBar => progressBar + 1)
			}, 250)
		}
	}

	function goToNext() {
		props.history.push(props.nextURL)
	}

	function closeFeedback() {
		clearInterval(timer)
		setProgressBar(0)
	}

	const feedback = overlay ? (<div styleName="feedback">
						<Close styleName="close" onClick={closeFeedback} />
						<h1>Well done! Next up: {props.nextTitle}</h1>
						<div styleName="progress">
							<LinearProgress variant="determinate" value={progressBar} />
							<PlayArrow styleName="go-now" onClick={goToNext} />
						</div>
						<CheckCircle styleName="done" /> 
					</div>) : <></>

	return (
		<>
			{feedback}
			<iframe styleName="task-embed" src={`${host}/task/embed/${props.topicslug}`}></iframe>
		</>
	)
}

let com = css(styles)(Task)
com = connect(mapStateToProps, {})(com)
com = withRouter(com)

export default com