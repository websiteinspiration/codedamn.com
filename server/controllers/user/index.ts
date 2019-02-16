import express from 'express'
import defaults from './default'
//import redirectUnauthenticated from '../../middlewares/UnauthenticatedUsers/redirectUnauthenticated'

export default router => {
	router.use('/', defaults)
}