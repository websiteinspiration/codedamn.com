//import auth from './auth'
import githubHooks from './githubHooks'
import socialLinks from './socialLinks'
import user from './user'
//import APIv1_0 from './api/v1.0'

import * as path from 'path'

export default router => {

//	auth(router)
	githubHooks(router)
	user(router)
	socialLinks(router)
//	APIv1_0(router)
   /* home(router)
    auth(router)
    user(router)
	hello(router) */

	

	router.get('*', (req, res) => {
		//const url = process.env.NODE_ENV === 'production' ? 'index.prod.html' : 'index.html'
		res.sendFile(path.resolve(__dirname, `../../index.prod.html`))
	})
}