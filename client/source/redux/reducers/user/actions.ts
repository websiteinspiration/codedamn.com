import { GOT_USER_SETTINGS } from './types'
import { FIRE_NOTIFICATION } from 'reducers/notifizer/types';
import axios from 'axios'
import { GRAPHQL } from 'components/globals'
import { successNotification, errorNotification } from 'reducers/notifizer/actions'


export const getUserSettings = _ => async dispatch => {

	const { data: { data }} = await axios.post(GRAPHQL, {
		query: `query {
			profileData{
				name
				email
				username
				damns
				doj
				activeDates
				activeStreak
			}
		}`
	})

	dispatch({ type: GOT_USER_SETTINGS, payload: data.profileData })
}

export const saveUserSettings = payload => async dispatch => {

	try {
		const { data: { data }} = await axios.post(GRAPHQL, {
			query: `mutation($newusername: String!, $newname: String!, $newpassword: String, $newcpassword: String) {
				changeSettings(newusername: $newusername, newname: $newname, newpassword: $newpassword, newcpassword: $newcpassword) {
					username
					name
				}
			}`,
			variables: payload
		})
		dispatch(successNotification("Done!"))
	} catch(error) {
		dispatch(errorNotification(error.response.data.errors[0].message))
	}
}

export const addEnergyPoints = payload => async dispatch => {
	
	
	const { data: { data }} = await axios.post(GRAPHQL, {
		query: `mutation($slug: String!, $parentslug: String!) {
			addEnergyPoints(slug: $slug, parentslug: $parentslug)
		}`,
		variables: payload
	})

	if(data.addEnergyPoints) {
		dispatch(successNotification(`Awesome work! Added ${data.addEnergyPoints} damn points.`))
	} else {
		dispatch(successNotification("You're already awarded for this lesson!"))
	}
}