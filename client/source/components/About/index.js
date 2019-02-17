import React from 'react'
import { Link } from 'react-router-dom'
import css from 'react-css-modules'
import styles from './styles.scss'
import Component from 'decorators/Component'
import { connect } from 'react-redux'

@connect(null, {})
@Component({ title: 'About Us', gridClass: styles.grid })
@css(styles)
export default class About extends React.Component {

	shouldComponentUpdate() {
		return false
	}

	render() {
		return (
			<div styleName="about">
				<h1>Why?</h1>
				<p>Why codedamn? I believed the world needed a better development hub on internet. A place where anyone who want to be a developer, and anyone who actually is a developer can feel home. codedamn enables different developers to connect and learn from the platform as well as from each other. At the same time, the platform enables you to validate what you've been learning. Plus, its all free, just like how making friends should be.</p>

				<h1>What?</h1>
				<p>What codedamn do essentially? It is basically consiting of 4 verticals right now, namely Learning, Connecting (under dev), Doing, and Keeping yourself updated. As a developer these 4 things are of utmost importance for your overall growth in short term as well as long term. codedamn aims to cover all those requirements.</p>

				<h1>How?</h1>
				<p>How codedamn does that? The learning vertical is handled by our <a href="https://learn.codedamn.com">learning platform</a>. We're working hard to bring a full fledged connecting platform, but as of now, we have the <a href="https://discuss.codedamn.com">chat up</a>. To validate your skills and have fun, start <a href="https://do.codedamn.com">doing some stuff</a>. The keeping-you-updated reading section is live on the <a href="https://bit.ly/codedamn-android">codedamn app</a>.</p>

				<h1>Get to us!</h1>
				<p>Hope you had fun reading about the platform! Please <Link to={'/feedback'}>contact us</Link> if you have any query through this page: <Link to={'/feedback'}>Feedback Page</Link></p>
			</div>
		)
	}
}