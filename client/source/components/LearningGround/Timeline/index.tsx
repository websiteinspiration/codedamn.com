import React, { useEffect } from 'react'
import Loading from 'components/Loading'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getSidebarTimeline, toggleTimelineVisibility } from 'reducers/learn/actions'
import css from 'react-css-modules'
import styles from './styles.scss'
import { PlayCircleFilled, Code, Star, Close, ArrowForward, ChromeReaderMode } from '@material-ui/icons'

const mapStateToProps = ({system, learn}) => ({
	timeline: learn.sidebarTimeline,
	isTimelineActive: learn.sidebarTimelineVisible
})


function Timeline(props) {

	useEffect(() => {
		if(!props.timeline) {
			props.getSidebarTimeline({
				slug: props.parentslug
			})
		}
	}, [])

	function toggleState() {
		props.toggleTimelineVisibility()
	}

	if(!props.timeline) return <div styleName="timeline"><Loading /></div>

	const visible = props.isTimelineActive

	return (<div styleName={`timeline ${visible ? '': 'hidden'}`}> 
		
		<div styleName="controls">
			<h2>Timeline</h2>
			<div styleName="close" onClick={toggleState}>{visible ? <Close /> : <ArrowForward />}</div>
		</div>
		<div styleName="dots" style={{height: window.innerHeight - 60 - 50 + 'px'}}> {/* TODO: Pass this as prop or something? */} {/* -30 for controls heading */}
			{props.timeline.map(elem => {
				let icon
				switch(elem.type) {
					case 'video':
						icon = <PlayCircleFilled />
						break
					case 'quiz':
						icon = <Star />
						break
					case 'task':
						icon = <Code />
						break
					case 'article':
						icon = <ChromeReaderMode />
						break
				}
				return (<div key={elem.slug} styleName={`dot ${props.dotslug === elem.slug ? 'bold': ''}`}>
						{icon}
						<Link to={elem.slug}>{elem.title}</Link>
					</div>)
			})}
		</div>
	</div>)
}

let com: any = css(styles, { allowMultiple: true })(Timeline)
com = connect(mapStateToProps, { getSidebarTimeline, toggleTimelineVisibility })(com)

export default com