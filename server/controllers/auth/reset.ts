import express from 'express'
import xdebug from 'debug'

import redirectAuthenticated from 'middlewares/AuthenticatedUsers/redirectAuthenticated'
import { user } from '@interfaces/user'
import User from 'models/user'
import fetch from 'node-fetch'
import * as bcrypt from 'bcrypt'
const router = express.Router()
const debug = xdebug('cd:Logout')

const { RECAPTCHA_SECRET } = process.env

router.post('/password-reset', redirectAuthenticated, async (req, res) => {
	const email = req.body.email
	const captcha = req.body['g-recaptcha-response']

    const result = await fetch(`https://www.google.com/recaptcha/api/siteverify?response=${captcha}&secret=${RECAPTCHA_SECRET}`, {
        method: 'GET'
	})

	const json = await result.json()
	
	if(json.success) {
		const user: user = await User.findDamner({ email })

		if(user) {
			const rawPassword = Math.random().toString(36).substring(7)
			user.password = bcrypt.hashSync(rawPassword, 10)
			await user.save()

			const r = await User.sendResetEmail({ name: user.name, email, password: rawPassword})

			if(r) {
				debug(`Sent reset email successfully to ${email}`)
			} else {
				debug(`Error sending password reset email to ${email}`, r)
			}

			return res.json({ status: "ok" })
		}
		return res.json({ status: "error", data: "User not found" })
	}

	return res.json({ status: "error", data: "Invalid captcha" })
})

export default router