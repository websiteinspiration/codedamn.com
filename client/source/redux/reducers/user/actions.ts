import { GOT_USER_SETTINGS } from './types'
import { FIRE_NOTIFICATION } from 'reducers/notifizer/types';
import axios from 'axios'
import { GRAPHQL } from 'components/globals'
import { successNotification, errorNotification } from 'reducers/notifizer/actions'


export const getUserSettings = _ => async dispatch => {
	const { data: json } = await axios.post(`/settings`)
	//console.log(json, 'get')

	dispatch({ type: GOT_USER_SETTINGS, payload: json })
}

export const saveUserSettings = payload => async dispatch => {
	const { data: json } = await axios.post(`/settings`, payload)
	console.log(json)
	if(json.status == 'error') {
		dispatch({ type: FIRE_NOTIFICATION, payload: { heading: 'Error!', body: json.data.toString() }})
		//alert(json.data.toString())
	} else if(json.status == 'ok') {
		dispatch({ type: FIRE_NOTIFICATION, payload: { heading: 'Success', body: 'Profile updated!' }})
	} else {
		dispatch({ type: FIRE_NOTIFICATION, payload: { heading: 'Error!', body: 'There was some technical error processing this request. We\'ve been informed. Please refresh the page' }})
		//alert('There was an error processing your request. We have been informed. Please refresh page')
		throw json
	}

 //	dispatch(updateCSRFToken())

	//dispatch({ type: GOT_USER_SETTINGS, payload: json })
}

export const addEnergyPoints = payload => async dispatch => {
	
	
	const { data: { data }} = await axios.post(GRAPHQL, {
		query: `mutation($slug: String!, $parentslug: String!) {
			addEnergyPoints(slug: $slug, parentslug: $parentslug)
		}`,
		variables: payload
	})

	if(data.addEnergyPoints) {
		dispatch(successNotification("Nice work! ++damns"))
	}

}