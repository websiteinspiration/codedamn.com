import React, { useEffect } from 'react'
import Loading from 'components/Loading'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getSidebarTimeline } from 'reducers/learn/actions'
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

	if(!props.timeline) return <div styleName="timeline"><Loading /></div>

	return (<div styleName="timeline"> 

		<div styleName="dots">
			{props.timeline.map((elem, index) => {
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
						<span styleName="number">{index + 1}</span>
						<Link to={elem.slug}>{elem.title}</Link>
					</div>)
			})}
		</div>
	</div>)
}

let com: any = css(styles, { allowMultiple: true })(Timeline)
com = connect(mapStateToProps, { getSidebarTimeline })(com)

export default com