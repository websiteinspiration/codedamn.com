import React from 'react'
import styles from './style.scss'
import YouTube from 'react-youtube'
import css from 'react-css-modules'
import { connect } from 'react-redux'


const mapStateToProps = ({ learn }) => ({
	isTimelineActive: learn.sidebarTimelineVisible,
	isChatActive: learn.isChatActive
})

function Video(props) {

	const opts = {
		playerVars: { // https://developers.google.com/youtube/player_parameters
			modestBranding: 1,
			info: false,
			showinfo: 0,
			controls: 1,
			ivLoadPolicy: 3,
			autoplay: 1,
			rel: 0,
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
				//onEnd={() => this.registerVideoWatched()}
			/>
		</div>
	)
}

let com = css(styles, { allowMultiple: true, handleNotFoundStyleName: 'log' })(Video)
com = connect(mapStateToProps, { })(com)
export default com