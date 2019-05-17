import axios from 'axios'
axios.defaults.withCredentials = true

import { successNotification, errorNotification } from 'reducers/notifizer/actions'
import { STORE_COURSES, TOGGLE_TIMELINE_VISIBILITY, SAVE_SIDEBAR_TIMELINE, STORE_DOT_INFO, CLEAR_TIMELINE_INFO, COMMENT_POSTED, STORE_TIMELINE_INFO, CLEAR_LEARNING_GROUND } from './types'
import { GRAPHQL } from 'components/globals'

export const getCourses = () => async dispatch => {
	try {
		const { data: { data } } = await axios.post(GRAPHQL, {
			query: `{
				learnblocks {
				  name
				  score
				  timelines {
					description
					id
					name
					icon
					slug
				  }
				}
			  }`
		})

		dispatch({ type: STORE_COURSES, payload: data.learnblocks })
	} catch(error) {
		console.error(error)
		errorNotification("Error fetching timelines. Are you online?")
	}
}

export const getTimelineInfo = payload => async dispatch => {

	dispatch({ type: CLEAR_TIMELINE_INFO })

	try {
		const { data: { data }} = await axios.post(GRAPHQL, {
			query: `query($slug: String!) {
				currentTimeline: timelineBySlug(slug: $slug) {
					name
					id
					icon
					views
					flow {
						title
						slug
						type
					}
				}
			}`,
			variables: payload
		})

		// TODO: fix the done and watched part
		dispatch({ type: STORE_TIMELINE_INFO, payload: { ...data, userflow: { done: [], watched: [] } } })

	} catch(error) {
		console.error(error)
	}
}

export const clearLearningGround = _ => ({ type: CLEAR_LEARNING_GROUND })

export const postComment = payload => async dispatch => {
	try {
		const { data: { data } } = await axios.post(GRAPHQL, {
			query: `mutation($parentSlug: String!, $slug: String!, $comment: String!) {
				addDotCommentBySlug(parentSlug: $parentSlug, slug: $slug, comment: $comment) {
					comment
					author
					date
					id
					avatar
				}
			}`,
			variables: payload
		})

		dispatch({ type: COMMENT_POSTED, payload: data.addDotCommentBySlug })
	} catch(error) {
		console.error(error)
	}
}



export const getDotInfo = payload => async dispatch => {
	try {
		const { data: { data } } = await axios.post(GRAPHQL, {
			query: `query($parentSlug: String!, $dotSlug: String!) {
				dotInfoBySlug(parentSlug: $parentSlug, dotSlug: $dotSlug) {
					comments {
						author
						id
						date
						avatar
						comment
						upvotes
					}
					currentTitle
					displayLangName
					videoExtras {
						vidid
					}
					quizExtras {
						code
						options {
							text
							correct
						}
					}
					nextTitle
					prevTitle
					nextURL
					prevURL
					type
				}
			}`,
			variables: payload
		})

		dispatch({ type: STORE_DOT_INFO, payload: data.dotInfoBySlug })
	} catch(error) {
		console.error(error)
	}
}

export const toggleTimelineVisibility = _ => ({ type: TOGGLE_TIMELINE_VISIBILITY })

export const getSidebarTimeline = payload => async dispatch => {
	try {
		const { data: {data } } = await axios.post(GRAPHQL, {
			query: `query($slug: String!) {
				timelineBySlug(slug: $slug) {
					flow {
						title
						slug
						type
					}
				}
			}`,
			variables: payload
		})

		dispatch({ type: SAVE_SIDEBAR_TIMELINE, payload: data.timelineBySlug.flow })
	} catch(error) {
		console.error(error)
	}
}
/*



export const toggleChatVisibility = _ => ({ type: TOGGLE_CHAT_VISIBILITY })

export const staticHeaderTitle = payload => ({ type: SET_STATIC_HEADER_TITLE, payload })

*/