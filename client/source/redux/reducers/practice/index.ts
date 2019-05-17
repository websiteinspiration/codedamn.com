import { 
	UPDATE_PRACTICE_BLOCK, CLEAR_REDUX_PRACTICE_PROPS, UPDATE_PRACTICE_NODES
} from './types'

const initialState = {
	activeBlock: null,
	activeNodes: null
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
		case UPDATE_PRACTICE_NODES:
			return {
				...state,
				activeNodes: payload
			}
		default:
			return state
	}
}