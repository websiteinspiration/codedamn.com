import { HIDE_NOTIFIZER, FIRE_NOTIFICATION } from './types'

const initalState = {
	visible: false,
	message: null,
	type: null
}

export default function(state = initalState, action) {
	switch(action.type) {
		case FIRE_NOTIFICATION:
			//debugger
			return {
				...state,
				visible: true,
				...action.payload
			}
		case HIDE_NOTIFIZER:
			return {
				...state,
				visible: false
			}
	}
	return state
}