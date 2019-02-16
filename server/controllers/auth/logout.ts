import express from 'express'
import xdebug from 'debug'
import loggedIn from 'middlewares/loggedIn';

const router = express.Router()
const debug = xdebug('cd:Logout')

// TODO: Add logout support for mobile app
router.post('/logout', loggedIn, (req, res) => {
	req.session.destroy(_ => {
		res.json({
			status: "ok"
		})
	})
})

export default router