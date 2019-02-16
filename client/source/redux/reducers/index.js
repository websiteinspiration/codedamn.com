import { combineReducers } from 'redux'
import system from './system'
import user from './user'
import notifizer from './notifizer'

export default combineReducers({
	system,
	user,
	notifizer
})