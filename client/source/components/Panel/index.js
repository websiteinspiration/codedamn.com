import React from 'react'
import { connect } from 'react-redux'
import styles from './styles.scss'
import css from 'react-css-modules'
import Component from '@decorators/Component'
import { Card, CardActionArea, CardContent, CardMedia, Typography, Button } from '@material-ui/core'
import Loading from '@components/Loading'

import { checkForUpdates } from '@reducers/system/actions'

const greetings = ['Hey', 'Hello', 'Hi']
const greeting = greetings[Math.floor(Math.random()*greetings.length)]

const mapStateToProps = ({system}) => ({
	user: system.user
})

const isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
}


@connect(mapStateToProps, { checkForUpdates })
@Component({ title: 'User Dashboard', gridClass: styles.grid })
@css(styles, { handleNotFoundStyleName: 'log', allowMultiple: true })
export default class Panel extends React.Component {

	componentWillMount() {
		this.props.checkForUpdates()
	}

	render() {

		if(!this.props.user) return <Loading />

		const { name, damns, status } = this.props.user

		const links = [
			{
				heading: "Read",
				link: isMobile.iOS() ? 'https://bit.ly/codedamn-ios' : 'https://bit.ly/codedamn-android',
				description: "Keep yourself updated with latest tech news!"
			},
			{
				heading: "Learn",
				link: "https://learn.codedamn.com",
				description: "This is the gym of developers. Upgrade yourself!",
				bg: "red"
			},
			{
				heading: "Projects",
				link: "https://do.codedamn.com/projects",
				description: "Think you're good? Prove it among the community!"
			},
			{
				heading: "Discuss",
				link: "https://discuss.codedamn.com",
				description: "A modern RTC built by developers, for developers."
			}
		]

		return (
<>				
				<div styleName="greeting-section">
					<h1>{greeting} {name}!</h1>
					<p>You're worth {damns || 0} damns and you're <b>{status}</b> at codedamn.</p>
					<p>Your level is decided by how active you're on platform, how much you contribute, use codedamn. Beware! It degrades as well if you don't use it ;)</p>
				</div>

				<div styleName="things2do">

					{links.map(block => {
						return (
						<Card key={block.link} styleName={`card ${block.bg || ''}`}> {/* styleName="block" onClick={() => this.props.history.push(`/${block.creator}/${block.slug}`)}> */ }
							<CardActionArea onClick={_ => window.ga?.('send', 'event', 'Vertical Visit', 'panel', block.link)} href={block.link}>
							<CardMedia
								styleName="media"
								title={block.heading}
								image={block.icon}
								/>
							
							<CardContent>
								<Typography gutterBottom variant="headline" component="h2">
									{block.heading}
								</Typography>
								<Typography component="p">
									{block.description}
								</Typography>
							</CardContent>
							</CardActionArea>
						</Card>)
					})}

				</div>
</>
		)
	}
}