import { 
	SAVE_SIDEBAR_TIMELINE, STORE_DOT_INFO, STORE_TIMELINES, STORE_TIMELINE_INFO, 
	CLEAR_TIMELINE_INFO, CLEAR_SIDEBAR_TIMELINE, TOGGLE_TIMELINE_VISIBILITY,
	TOGGLE_CHAT_VISIBILITY, CLEAR_LEARNING_GROUND, SET_STATIC_HEADER_TITLE,
	COMMENT_POSTED
} from './types'

const initialState ={
	blocks: null,
	currentTimeline: null,
	dotInfo: null,
	sidebarTimeline: null,
	sidebarTimelineVisible: true,
	isChatActive: false,
	staticHeaderTitle: 'codedamn'
}

export default function learn(state = initialState, { type, payload }) {
	switch(type) {
		case COMMENT_POSTED:
			return {
				...state,
				dotInfo: {
					...state.dotInfo,
					comments: [payload, ...state.dotInfo.comments]
				}
			}
		case SET_STATIC_HEADER_TITLE:
			return {
				...state,
				staticHeaderTitle: payload
			}
		case CLEAR_LEARNING_GROUND:
			return {
				...state,
				sidebarTimeline: null,
				currentTimeline: null,
				sidebarTimelineVisible: true,
				isChatActive: false,
				dotInfo: null
			}
		case TOGGLE_CHAT_VISIBILITY:
			return {
				...state,
				isChatActive: !state.isChatActive
			}
		case TOGGLE_TIMELINE_VISIBILITY:
			return {
				...state,
				sidebarTimelineVisible: !state.sidebarTimelineVisible
			}
		case SAVE_SIDEBAR_TIMELINE:
			return {
				...state,
				sidebarTimeline: payload
			}
		case CLEAR_SIDEBAR_TIMELINE:
			return {
				...state,
				sidebarTimeline: null
			}
		case STORE_DOT_INFO:
			return {
				...state,
				dotInfo: payload
			}
		case STORE_TIMELINES:
			return {
				...state,
				blocks: payload
			}
		case STORE_TIMELINE_INFO:
			return {
				...state,
				currentTimeline: payload.currentTimeline,
				userflow: payload.userflow
			}
		case CLEAR_TIMELINE_INFO:
			return {
				...state,
				currentTimeline: null
			}
		default:
			return state
	}
}