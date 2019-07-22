import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import styles from './styles.scss'
import css from 'react-css-modules'
import Component from 'decorators/Component'
import { Tabs, Tab, Card, CardActionArea, Link, CardMedia, CardContent, Typography } from '@material-ui/core'
import Loading from 'components/Loading'
import SwipeableViews from 'react-swipeable-views'
import { checkForUpdates } from 'reducers/system/actions'
import { getCourses } from 'reducers/learn/actions'

import PaymentButton from 'components/PaymentButton'

const greetings = ['Hey', 'Hello', 'Hi']
const greeting = greetings[Math.floor(Math.random() * greetings.length)]

const mapStateToProps = ({ system }) => ({
	user: system.user,
	courses: system.courses
})

const isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function () {
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	}
}

// TODO: Move activeTab to redux for persisted tab on navigation

function Panel(props) {

	useEffect(() => {
		props.checkForUpdates()
		props.getCourses()
	}, [])

	const [activeTab, setActiveTab] = useState(0)
	
	if (!props.user) return <Loading />

	const tabs = props.courses.map(block => block.timelines).flat(Infinity).sort(_ => 0.5 - Math.random()).slice(0, 4).map(getBlockMarkup)

	const { name, damns, status } = props.user

	const blocks3 = <div styleName="random-recommendations">
		{tabs}
	</div>

	const Dashboard = (<div styleName="greeting-section">
		<h1>{greeting} {name}!</h1>
		<p>You have {damns || 0} damns at codedamn.</p>
		{/*<PaymentButton />*/}
		<h2 styleName="learning-heading">Here's what people are learning right now:</h2>
		{blocks3}
	</div>)

	const Courses = props.courses.map(block => {
		const blockList = block.timelines.map(getBlockMarkup)
		return (
			<React.Fragment key={block.name}>
				<h2 styleName="block-title">{block.name}</h2>
				<div styleName="block-list">{blockList}</div>
			</React.Fragment>)
	})

	const Practice = <div styleName="practice">
		<h1 styleName="heading">Available Modules</h1>
		<div styleName="practice-modules">
			{getBlockMarkup({
				slug: 'html5',
				isPractice: true,
				description: 'Get your basics of HTML5 up and ready!',
				icon: 'html5.jpg',
				name: 'HTML5 Basics'
			})}

			{getBlockMarkup({
				slug: 'css3',
				isPractice: true,
				description: 'Get your CSS3 basics up and ready!',
				icon: 'html5css3.jpg',
				name: 'CSS3 Basics'
			})}


			{getBlockMarkup({
				slug: 'javascript',
				isPractice: true,
				description: 'Get your JavaScript basics up and ready!',
				icon: 'javascript.jpg',
				name: 'JavaScript Basics'
			})}

			{getBlockMarkup({
				slug: 'xss',
				isPractice: true,
				description: 'Get your XSS basics up and ready!',
				icon: 'xss.jpg',
				name: 'XSS Basics'
			})}
		</div>
	</div>

	return (
		<>
			<Tabs
				value={activeTab}
				onChange={(_, value) => setActiveTab(value)}
				indicatorColor="primary"
				textColor="primary"
				centered>
				<Tab label="Dashboard" />
				<Tab label="All Courses" />
				<Tab label="Practice" />
			</Tabs>

			<SwipeableViews
				axis={'x'}
				index={activeTab}
				onChangeIndex={index => setActiveTab(index)}>
				<div styleName="dashboard-tab">
					{Dashboard}
				</div>
				<div styleName="courses-tab">
					{Courses}
				</div>
				<div styleName="tab">
					{Practice}
				</div>
			</SwipeableViews>

		</>
	)

	interface block {
		slug: string
		paidPrice?: string
		paidURL?: string
		name: string
		icon: string
		description: string,
		isPractice: boolean
	}

	function getBlockMarkup(block: block) {

		let onClick = () => props.history.push(`/${block.isPractice ? 'practice' : 'learn'}/${block.slug}`)
		let ribbonClass = 'ribbon'
		let ribbonLabel = 'Free'

		if(block.paidPrice) {
			ribbonClass += ' paid'
			ribbonLabel = block.paidPrice
			onClick = () => window.open(block.paidURL)
		}

		return (
			<div styleName="card" key={block.slug} onClick={onClick}>
				{/*<div styleName={ribbonClass}><span>{ribbonLabel}</span></div>*/}
				<div styleName="cardaction">
					<img src={`/assets/images/courses/${block.icon}`} />
				</div>
				<div styleName="cardcontent">
					<h2>{block.name}</h2>
					<p>{block.description}</p>
				</div>
			</div>
		)
	}
}

let com: any = css(styles, { handleNotFoundStyleName: 'log', allowMultiple: true })(Panel)
com = Component({ title: 'User Dashboard', gridClass: styles.grid })(com)
com = connect(mapStateToProps, { checkForUpdates, getCourses })(com)
export default com