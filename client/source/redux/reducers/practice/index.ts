import { 
	UPDATE_PRACTICE_BLOCK, CLEAR_REDUX_PRACTICE_PROPS
} from './types'

const initialState = {
	activeBlock: null
}

export default function practice(state = initialState, { type, payload }) {
	switch(type) {
		case UPDATE_PRACTICE_BLOCK:
			return {
				...state,
				activeBlock: payload
			}
		case CLEAR_REDUX_PRACTICE_PROPS:
			return initialState
		default:
			return state
	}
}