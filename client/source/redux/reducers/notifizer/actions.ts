import { FIRE_NOTIFICATION, HIDE_NOTIFIZER } from './types'

export const errorNotification = payload => ({ type: FIRE_NOTIFICATION, 
	payload: {
		message: payload,
		type: 'error'
	} 
})

export const successNotification = payload => ({ type: FIRE_NOTIFICATION, 
	payload: {
		message: payload,
		type: 'success'
	} 
})

export const infoNotification = payload => ({ type: FIRE_NOTIFICATION, 
	payload: {
		message: payload,
		type: 'info'
	} 
})

export const warningNotification = payload => ({ type: FIRE_NOTIFICATION, 
	payload: {
		message: payload,
		type: 'warning'
	} 
})

export const hideNotifizer = _ => ({ type: HIDE_NOTIFIZER })