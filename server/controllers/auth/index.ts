import login from './login'
import register from './register'
import logout from './logout'
import reset from './reset'

export default router => {
    router.use('/', login)
    router.use('/', register)    
	router.use('/', logout)
	router.use('/', reset)
}