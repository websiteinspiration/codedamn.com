import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import styles from './styles.scss'
import css from 'react-css-modules'
import Component from 'decorators/Component'
import { Paper, Tabs, Tab, Card, CardActionArea, Link, CardMedia, CardContent, Typography } from '@material-ui/core'
import Loading from 'components/Loading'
import SwipeableViews from 'react-swipeable-views'
import { checkForUpdates, getCourses } from 'reducers/system/actions'

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


function Panel(props) {

	useEffect(() => {
		props.checkForUpdates()
		props.getCourses()
	}, [])

	const [activeTab, setActiveTab] = useState(0)


	if (!props.user) return <Loading />

	const { name, damns, status } = props.user

	const links = [
		{
			heading: "Read",
			link: isMobile.iOS() ? 'https://bit.ly/codedamn-ios' : 'https://bit.ly/codedamn-android',
			description: "Keep yourself updated with latest tech news!",
			icon: null
		},
		{
			heading: "Learn",
			link: "https://learn.codedamn.com",
			description: "This is the gym of developers. Upgrade yourself!",
			bg: "red",
			icon: null
		},
		{
			heading: "Projects",
			link: "https://do.codedamn.com/projects",
			description: "Think you're good? Prove it among the community!",
			icon: null
		},
		{
			heading: "Discuss",
			link: "https://discuss.codedamn.com",
			description: "A modern RTC built by developers, for developers.",
			icon: null
		}
	]

	const Dashboard = (<div styleName="greeting-section">
		<h1>{greeting} {name}!</h1>
		<p>You're worth {damns || 0} damns and you're <b>{status}</b> at codedamn.</p>
		<p>Your level is decided by how active you're on platform, how much you contribute, use codedamn. Beware! It degrades as well if you don't use it ;)</p>
	</div>)

	const Courses = props.courses.map(block => {
		const blockList = block.timelines.map(block => {
			return (
				<Card key={block.slug} styleName="card"> {/* styleName="block" onClick={() => this.props.history.push(`/${block.creator}/${block.slug}`)}> */}
					<CardActionArea styleName="cardaction">
						<CardMedia
							styleName="media"
							title={block.name}
							image={`/assets/images/courses/${block.icon}`}
						/>

						<CardContent styleName="cardcontent">
							<Typography gutterBottom variant="headline" component="h2">
								{block.name}
							</Typography>
							<Typography component="p">
								{block.description}
							</Typography>
						</CardContent>
					</CardActionArea>
				</Card>)

		})
		return (
			<React.Fragment key={block.name}>
				<h2 styleName="block-title">{block.name}</h2>
				<div styleName="block-list">{blockList}</div>
			</React.Fragment>)
	})

	const Practice = <h1>P</h1>

	return (
		<>
			<Paper>
				<Tabs
					value={activeTab}
					onChange={(_, value) => setActiveTab(value)}
					indicatorColor="primary"
					textColor="primary"
					centered>
					<Tab label="Dashboard" />
					<Tab label="Courses" />
					<Tab label="Practice" />
				</Tabs>
			</Paper>

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
}

let com = css(styles, { handleNotFoundStyleName: 'log', allowMultiple: true })(Panel)
com = Component({ title: 'User Dashboard', gridClass: styles.grid })(com)
com = connect(mapStateToProps, { checkForUpdates, getCourses })(com)
export default com