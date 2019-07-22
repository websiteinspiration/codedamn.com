import React, { useEffect } from 'react'
import Video from './Video'
import Task from './Task'
import Quiz from './Quiz'
import { connect } from 'react-redux'
import styles from './style.scss'
import css from 'react-css-modules'
import Loading from 'components/Loading'
import { getDotInfo, postComment } from 'reducers/learn/actions'
import CommentSystem from 'components/LearningGround/CommentSystem'
import Timeline from '../Timeline'
import { clearLearningGround } from 'reducers/learn/actions'
import Component from 'decorators/Component'

const mapStateToProps = ({ learn, system: { user } }, { match: { params }}) => ({
	dotInfo: learn.dotInfo,
	parentslug: params.parentslug,
	dotslug: params.dotslug,
	profilepic: user.profilepic
})

function ContentInterface(props) {

	useEffect(() => {
		props.getDotInfo({
			parentSlug: props.parentslug,
			dotSlug: props.dotslug
		})

		return () => props.clearLearningGround()
	}, [])

	useEffect(() => {
		props.getDotInfo({
			parentSlug: props.parentslug,
			dotSlug: props.dotslug
		})
	}, [props.dotslug])

	function postComment(comment) {
		props.postComment({
			comment,
			parentSlug: props.parentslug,
			slug: props.dotslug
		})
	}

	function getRenderComponent() {

		const { dotInfo } = props
		if (!dotInfo) return null

		switch (dotInfo.type) {
			case 'quiz':
				return <Quiz />
			case 'video':
				return <Video
					vidid={dotInfo.videoExtras.vidid}
					slug={props.dotslug}
					parentslug={props.parentslug}
				/>
			case 'task':
				return <Task />
		}
	}

	const component = getRenderComponent()

	if (!component) return <Loading />
	const { dotInfo } = props

return <>

		<h1 styleName="dot-heading">
			{dotInfo.currentTitle}
			<span styleName="damns-included">(10 damns++ on completion!)</span>
		</h1>

		<div styleName="top-component">
			{component}
			<Timeline parentslug={props.parentslug} dotslug={props.dotslug} />
		</div>

		<CommentSystem
			comments={dotInfo.comments}
			postComment={comment => postComment(comment)}
			profilepic={props.profilepic}
		/>
	</>
}

let com: any = css(styles, { handleNotFoundStyleName: 'log' })(ContentInterface)
com = connect(mapStateToProps, { getDotInfo, clearLearningGround, postComment })(com)
com = Component({ gridClass: styles.grid })(com)

export default com