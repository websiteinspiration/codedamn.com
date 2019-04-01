import { 
	SET_HEADER_TYPE, SET_KEY_VALUE, USER_LOGGED_IN, USER_LOGGED_OUT, 
	SET_CSRF_TOKEN, STORE_DAMN_TABLE, CLEAR_REG_FORM
} from './types'

const initialState = {
	user: null,
	register: {},
	userLoggedIn: false,
	csrfToken: null,
	headerType: null
}

export default function(state = initialState, {type, payload}) {
	switch(type) {
		case CLEAR_REG_FORM:
			return {
				...state,
				register: {}
			}
		case SET_HEADER_TYPE:
			return {
				...state,
				headerType: payload
			}
		case STORE_DAMN_TABLE:
			return {
				...state,
				damntable: payload.data
			}
		case USER_LOGGED_IN:
			//debugger
			return {
				...state,
				user: payload,
				userLoggedIn: true
			}
		case USER_LOGGED_OUT:
			return {
				...initialState,
				headerType: state.headerType,
				csrfToken: state.csrfToken
			}
		case SET_CSRF_TOKEN: {
			return {
				...state,
				csrfToken: payload
			}
		}
		case SET_KEY_VALUE: {
			return {
				...state,
				register: {
					...state.register,
					[payload.key]: payload.value
				}
			}
		}
		default:
			return state
	}
}