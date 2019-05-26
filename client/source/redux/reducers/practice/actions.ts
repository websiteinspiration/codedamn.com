import { GRAPHQL } from "components/globals"
import axios from "axios"
import { UPDATE_PRACTICE_BLOCK, CLEAR_REDUX_PRACTICE_PROPS, UPDATE_PRACTICE_NODES } from './types'
import { successNotification } from "reducers/notifizer/actions"

export const getPracticeBlock = payload => async dispatch => {
	try {
		const { data: { data } } = await axios.post(GRAPHQL, {
			query: `query($challengeid: String!, $moduleid: String!) {
				practiceBlock(challengeid: $challengeid, moduleid: $moduleid) {
					title
					description
					mode
					challenges {
					  text
					  testString
					}
					headScript
					tailScript
					defaultValue
					nextslug
					type
				}
			}`,
			variables: payload
		})

		dispatch({ type: UPDATE_PRACTICE_BLOCK, payload: data.practiceBlock })
	} catch(error) {
		console.error(error)
	}
}

export const getPracticeNodes = payload => async dispatch => {
	try {
		const { data: { data } } = await axios.post(GRAPHQL, {
			query: `query($moduleid: String!) {
				practiceNodes(moduleid: $moduleid) {
					title
					slug
				}
				profileData {
					practiceDone
				}
			}`,
			variables: payload
		})

		data.practiceNodes.forEach(node => {
			if(data.profileData.practiceDone.includes(node.slug)) {
				node.done = true
			} else {
				node.done = false
			}
		})

		dispatch({ type: UPDATE_PRACTICE_NODES, payload: data.practiceNodes })
	} catch(error) {
		console.error(error)
	}
}

export const clearReduxProps = _ => ({ type: CLEAR_REDUX_PRACTICE_PROPS })

export const practiceCompleted = payload => async dispatch => {
	try {
		const { data: { data } } = await axios.post(GRAPHQL, {
			query: `mutation($challengeid: String!, $moduleid: String!) {
				practiceCompleted(challengeid: $challengeid, moduleid: $moduleid)
			}`,
			variables: payload
		})

		if(data.practiceCompleted) {
			// first time
			dispatch(successNotification("Nice work! ++damns"))
		}

	} catch(error) {
		console.error(error)
	}
}