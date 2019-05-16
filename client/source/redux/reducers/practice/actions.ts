import { GRAPHQL } from "components/globals"
import axios from "axios"
import { UPDATE_PRACTICE_BLOCK, CLEAR_REDUX_PRACTICE_PROPS } from './types'

export const getPracticeBlock = payload => async dispatch => {
	try {
		const { data: { data } } = await axios.post(GRAPHQL, {
			query: `query($challengeid: String!, $moduleid: String!) {
				practiceBlock(challengeid: $challengeid, moduleid: $moduleid) {
					title
					description
					challenges{
					  text
					  testString
					}
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

export const clearReduxProps = _ => ({ type: CLEAR_REDUX_PRACTICE_PROPS })