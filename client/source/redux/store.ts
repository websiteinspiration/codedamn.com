import {createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import createHistory from "history/createBrowserHistory"
import { routerMiddleware } from 'react-router-redux'

const initialState = {}
const history = createHistory()

const middlewares = [thunk, routerMiddleware(history)]

let store

if((window as any).__REDUX_DEVTOOLS_EXTENSION__) {
	store = createStore(
		rootReducer, 
		initialState, 
		compose(
			applyMiddleware(...middlewares),
			(window as any).__REDUX_DEVTOOLS_EXTENSION__()
		)
	)
} else {
	store = createStore(
		rootReducer, 
		initialState, 
		compose(
			applyMiddleware(...middlewares)
		)
	)
}

export { store, history } //{ store, persistor }