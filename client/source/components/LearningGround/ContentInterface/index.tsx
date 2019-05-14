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
import Helmet from 'react-helmet'

const mapStateToProps = ({ learn }) => ({
	dotInfo: learn.dotInfo
})

function ContentInterface(props) {

	useEffect(() => {
		props.getDotInfo({
			parentSlug: props.parentslug,
			dotSlug: props.dotslug
		})

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
		{component}
		<CommentSystem
			comments={dotInfo.comments}
			postComment={comment => postComment(comment)}
		/>
	</>
}

let com: any = css(styles)(ContentInterface)
com = connect(mapStateToProps, { getDotInfo, postComment })(com)

export default com