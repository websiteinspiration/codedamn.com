import React from 'react'
import styles from './style.scss'
import YouTube from 'react-youtube'
import css from 'react-css-modules'
import { connect } from 'react-redux'
import { addEnergyPoints } from 'reducers/user/actions'

const mapStateToProps = ({ learn }) => ({
	isTimelineActive: learn.sidebarTimelineVisible,
	isChatActive: learn.isChatActive
})

function Video(props) {

	const opts = {
		playerVars: { // https://developers.google.com/youtube/player_parameters
			modestBranding: 1,
			info: false,
			showinfo: 0 as 0,
			controls: 1 as 1,
			ivLoadPolicy: 3,
			autoplay: 1 as 1,
			rel: 0 as 0,
			origin: location.hostname === "localhost" ? "http://localhost:1338" : "https://learn.codedamn.com"
		}
	}

	const { vidid, isTimelineActive, isChatActive } = props
	
	let probableWidth = document.body.clientWidth - 40 - (isTimelineActive ? 300 : 0) - (isChatActive ? 300 : 0) // width of timeline/chat
	let probableHeight = window.innerHeight - 73 // height of header

	if(probableWidth/probableHeight >= 1.777) { // available width is more
		probableWidth = 16*probableHeight/9
	} else {
		probableHeight = 9*probableWidth/16
	}

	return (
		<div styleName="ytplayer" style={{width: probableWidth + 'px', height: probableHeight + 'px' }}>
			<YouTube
				videoId={vidid}
				opts={opts}
				//onReady={func}
				//onPlay={func}
				//onPause={func}
				onEnd={increaseEnergy}
				//onError={func}
			/>
		</div>
	)

	function increaseEnergy() {
		props.addEnergyPoints({ 
			slug: props.slug,
			parentslug: props.parentslug
		})
	}
}

let com: any = css(styles, { allowMultiple: true, handleNotFoundStyleName: 'log' })(Video)
com = connect(mapStateToProps, { addEnergyPoints })(com)
export default com