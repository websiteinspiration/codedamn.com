import { GOT_USER_SETTINGS } from './types'

const initialState = {}

export default function user(state = initialState, action) {
	switch(action.type) {
		case GOT_USER_SETTINGS:
			console.log(action)
			return {
				...state,
				settings: action.payload,
			}
		default:
			return state
	}
}