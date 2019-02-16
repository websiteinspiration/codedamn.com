import express from 'express'
import xdebug from 'debug'
import User from 'models/user'
import redirectAuthenticated from 'middlewares/AuthenticatedUsers/redirectAuthenticated'
import fetch from 'node-fetch'
import { user } from '@interfaces/user'
import * as Sentry from '@sentry/node'
const router = express.Router()
const debug = xdebug('cd:Login')
import Joi from 'joi'

import { oauthLogin } from './schema'
import * as cookie from 'cookie-signature'

const { GOOGLE_AUD_ID, FACEBOOK_APP_ID, FACEBOOK_ACCESS_TOKEN, COOKIE_SECRET } = process.env

router.post('/login', redirectAuthenticated, async (req, res, next) => {
	const { username, password, oauth } = req.body
	const { error, value } = Joi.validate(oauth, oauthLogin)

	let user
	if (!error) {
		// OAuth login OR registration

		const { oauthprovider: provider, id } = value

		if (provider === 'google') {

			const data = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${id}`)

			const res = await data.json() // change this from email to unique user ID because if person did not gave access to email while registering but filled it later on then it'll not login through OAuth provider

			const { aud, sub, picture } = res
			const email = res.email

			if (aud !== GOOGLE_AUD_ID) {
				debug(`Somebody messin around google OAuth => ${email}`)
				return { status: 'error', data: 'Invalid OAuth request' }
			}

			user = await User.findDamner({ googleID: sub })

			if (user && user.profilepic == "https://codedamn.com/assets/images/avatar.jpg" && picture) {
				user.profilepic = picture.replace('s96', 's256')
				await user.save()
			}

		} else if (provider === 'facebook') {

			const res = await fetch(`https://graph.facebook.com/debug_token?input_token=${id}&access_token=${FACEBOOK_ACCESS_TOKEN}`)
			const { data: { app_id, application, user_id } } = await res.json()

			if (app_id !== FACEBOOK_APP_ID || application !== 'codedamn' || !user_id) {
				debug(`Somebody messin around fb OAuth login `)
				return { status: 'error', data: 'Invalid OAuth request' }
			}

			user = await User.findDamner({ facebookID: user_id })

			// added on oct 16 2018 for existing users
			if (user && user.profilepic == "https://codedamn.com/assets/images/avatar.jpg") {
				// update profilepic
				const photo = `https://graph.facebook.com/${user.facebookID}/picture?type=large`
				user.profilepic = photo
				await user.save()
			}
		}


		if (user) {
			// User exists, i.e. valid login

			req.session.user = user
			req.session.auth = true

			const token = encodeURIComponent(cookie.sign(req.sessionID, COOKIE_SECRET))
			const progressBar = User.getProgressBar(user.damns)

			Sentry.configureScope((scope) => {
				scope.setUser({ email: user.email, username: user.username })
			})

			return res.json({
				status: 'ok', data: {
					progressBar,
					profilepic: user.profilepic,
					email: user.email,
					name: user.name,
					username: user.username,
					firstTime: user.firstTime,
					token,
					status: User.getStatus(user.damns),
					damns: user.damns
				}
			})

		} else {

			// user doesn't exist => need registration

			return res.json({ status: 'error', data: 'Email/Account not found. Please register first' })

		}


	}
	// If here => not OAuth Login

	let data: user = await User.findDamnerByUsernamePassword(username, password)

	if (data) {
		// User exists! Create a session

		req.session.user = data
		req.session.auth = true

		//const token = req.sessionID // token is for mobile app

		const token = encodeURIComponent(cookie.sign(req.sessionID, COOKIE_SECRET))

		const { email, name, username, firstTime, damns, profilepic } = data

		Sentry.configureScope((scope) => {
			scope.setUser({ email, username: username })
		})

		return res.json({ status: 'ok', data: { profilepic, email, name, username, firstTime, token, status: User.getStatus(damns), damns } })
	} else {
		res.json({ status: 'error', data: 'Incorrect username/password' })
	}

})

export default router