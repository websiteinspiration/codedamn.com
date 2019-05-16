import { combineReducers } from 'redux'
import system from './system'
import user from './user'
import notifizer from './notifizer'
import learn from './learn'
import practice from './practice'

export default combineReducers({
	system,
	user,
	notifizer,
	learn,
	practice
})