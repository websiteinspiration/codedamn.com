import xdebug from 'debug'
const debug = xdebug('cd:redirectAuthMW')


function redirectAuthenticated(req, res, next) {
    //debug(req.session)
    if(req.session.auth) {
		// already authenticated users need not see these pages

		const { email, name, username, firstTime } = req.session.user
		const token = req.sessionID

		return res.json({ status: 'ok', data: { email, name, username, firstTime, token } })
       // return res.json({ status: 'redirect', data: '/panel', token: req.sessionID })
    } else {
        next()
    }
}

export default redirectAuthenticated