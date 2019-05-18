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

	const blocks3 = <div styleName="random-recommendations">
		{props.courses.map(block => block.timelines).flat(Infinity).sort(_ => 0.5 - Math.random()).slice(0, 4).map(getBlockMarkup)}
	</div>

	const Dashboard = (<div styleName="greeting-section">
		<h1>{greeting} {name}!</h1>
		<p>You're worth {damns || 0} damns at codedamn.</p>
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
			<Card styleName="card"> {/* styleName="block" onClick={() => this.props.history.push(`/${block.creator}/${block.slug}`)}> */}
				<div styleName="ribbon"><span>Free</span></div>
				<CardActionArea styleName="cardaction"  onClick={() => props.history.push(`/practice/html5`)}>
					<CardMedia
						styleName="media"
						title={"HTML5 Basics"}
						image={`/assets/images/courses/html5.jpg`}
					/>
					
					<CardContent styleName="cardcontent">
						<Typography gutterBottom variant="headline" component="h2">
							HTML5 Basics
						</Typography>
						<Typography component="p">
							Get your basics of HTML5 up and ready!
						</Typography>
					</CardContent>
				</CardActionArea>
			</Card>

			<Card styleName="card"> {/* styleName="block" onClick={() => this.props.history.push(`/${block.creator}/${block.slug}`)}> */}
				<div styleName="ribbon"><span>Free</span></div>
				<CardActionArea styleName="cardaction" onClick={() => props.history.push(`/practice/css3`)}>
					<CardMedia
						styleName="media"
						title={"CSS3 Basics"}
						image={`/assets/images/courses/html5css3.jpg`}
					/>
					
					<CardContent styleName="cardcontent">
						<Typography gutterBottom variant="headline" component="h2">
							CSS3 Basics
						</Typography>
						<Typography component="p">
							Get your CSS3 basics up and ready!
						</Typography>
					</CardContent>
				</CardActionArea>
			</Card>


			<Card styleName="card"> {/* styleName="block" onClick={() => this.props.history.push(`/${block.creator}/${block.slug}`)}> */}
				<div styleName="ribbon"><span>Free</span></div>
				<CardActionArea styleName="cardaction" onClick={() => props.history.push(`/practice/javascript`)}>
					<CardMedia
						styleName="media"
						title={"JavaScript Basics"}
						image={`/assets/images/courses/javascript.jpg`}
					/>
					
					<CardContent styleName="cardcontent">
						<Typography gutterBottom variant="headline" component="h2">
							JavaScript Basics
						</Typography>
						<Typography component="p">
							Get your JavaScript basics up and ready!
						</Typography>
					</CardContent>
				</CardActionArea>
			</Card>
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

	function getBlockMarkup(block) {

		let onClick = () => props.history.push(`/learn/${block.slug}`)
		let ribbonClass = 'ribbon'
		let ribbonLabel = 'Free'

		if(block.paidPrice) {
			ribbonClass += ' paid'
			ribbonLabel = block.paidPrice
			onClick = () => window.open(block.paidURL)
		}

		return (
			<Card key={block.slug} styleName="card"> {/* styleName="block" onClick={() => this.props.history.push(`/${block.creator}/${block.slug}`)}> */}
				<div styleName={ribbonClass}><span>{ribbonLabel}</span></div>
				<CardActionArea styleName="cardaction" onClick={onClick}>
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
	}
}

let com: any = css(styles, { handleNotFoundStyleName: 'log', allowMultiple: true })(Panel)
com = Component({ title: 'User Dashboard', gridClass: styles.grid })(com)
com = connect(mapStateToProps, { checkForUpdates, getCourses })(com)
export default com