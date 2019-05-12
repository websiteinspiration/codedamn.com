import { 
	SET_KEY_VALUE, SET_CSRF_TOKEN, USER_LOGGED_IN, USER_LOGGED_OUT, 
	STORE_DAMN_TABLE, SET_HEADER_TYPE, CLEAR_REG_FORM, STORE_COURSES
} from './types'
import axios from 'axios'

import { history } from 'reducers/../store' // TODO: Clean fix this.
import { GRAPHQL } from 'components/globals'
import { successNotification, errorNotification } from 'reducers/notifizer/actions'

export const setKeyValueRegister = payload => ({ type: SET_KEY_VALUE, payload })
export const userLoggedIn = payload => ({ type: USER_LOGGED_IN, payload })

export const logoutUser = _ => async dispatch => {
	try {

		const { data: { data } } = await axios.post(GRAPHQL, {
			query: `mutation {
				logout
			}`
		})

		if(data.logout) {
			dispatch({
				type: USER_LOGGED_OUT
			})
		
			dispatch(successNotification("You are logged out"))
		
			history.push('/')
		}
		
	} catch(error) {
		console.error(error)
	}
	
}

export const clearRegForm = _ => ({ type: CLEAR_REG_FORM })

export const checkForUpdates = _ => async dispatch => {

	try {
		const { data: { data } } = await axios.post(GRAPHQL, {
			query: `{
				profileData {
				  name
				  username
				  damns
				  email
				  status
				}
			}`
		})
	
		if(!data.profileData) {
			dispatch({ type: USER_LOGGED_OUT })

		} else {
			dispatch({
				type: USER_LOGGED_IN,
				payload: data.profileData
			})
		}
	} catch(error) {
		console.error(error)
	}
}

export const getDamnTable = () => async dispatch => {
	try {
		const { data: { data } } = await axios.post(GRAPHQL, {
			query: `{
				rankings {
					damns
					username
					name
					doj
				}
			}`
		})

		dispatch({ type: STORE_DAMN_TABLE, payload: data.rankings })

	} catch(error) {
		console.error(error)
	}
}