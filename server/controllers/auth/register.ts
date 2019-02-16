import express from 'express'
import xdebug from 'debug'
import User from 'models/user'
import fetch from 'node-fetch'
import redirectAuthenticated from 'middlewares/AuthenticatedUsers/redirectAuthenticated'
import { user } from '@interfaces/user'
import Joi from 'joi'
import { oauthLogin } from './schema'
import * as cookie from 'cookie-signature'


// TODO: Reset this fb access token and move it to environment
const router = express.Router()
const debug = xdebug('cd:Register')

const { FACEBOOK_APP_ID, GOOGLE_AUD_ID, COOKIE_SECRET, RECAPTCHA_SECRET, FACEBOOK_ACCESS_TOKEN } = process.env

router.post('/register', redirectAuthenticated, async (req, res) => {

	const { name, username, password, email, cpassword, oauth } = req.body

	const { error, value } = Joi.validate(oauth, oauthLogin)
	const regIPaddress = String(req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim()
	
	if(!error) {
		// valid OAuth registration

		let facebookID
		let googleID
		let profilepic = `https://codedamn.com/assets/images/avatar.jpg`

		const { oauthprovider: provider, id } = value

		if(provider === 'google') {
			const res = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${oauth.id}`)
			const { email: googleemail, aud, sub, picture } = await res.json()


			if((googleemail && googleemail !== email) || aud !== GOOGLE_AUD_ID) {
				debug(`Somebody messin around => `, email)
				return { status: 'error', data: 'Invalid OAuth request' }
			}

			googleID = sub

			if(picture) {
				profilepic = picture
			}

		} else if(provider === 'facebook') {
			const resz = await fetch(`https://graph.facebook.com/debug_token?input_token=${oauth.id}&access_token=${FACEBOOK_ACCESS_TOKEN}`)
			const { data:{app_id, application, user_id} } = await resz.json()
		
			// TODO: Move aud to environment?
			if(app_id !== FACEBOOK_APP_ID || application !== 'codedamn') {
				debug(`Somebody messin around fb OAuth => `, email)
				return res.json({ status: 'error', data: 'Invalid OAuth request' })
			}

			const res2 = await fetch(`https://graph.facebook.com/v2.8/me?access_token=${oauth.id}&fields=id%2Cname%2Cemail&method=get&pretty=0&sdk=joey&suppress_http_code=1`)

			const { id } = await res2.json()

			if(id !== user_id) {
				debug(`Somebody messin around fbOAuth => `, email)
				return res.json({ status: 'error', data: 'Invalid OAuth request' })
			}

			facebookID = id

			profilepic = `https://graph.facebook.com/${facebookID}/picture?type=large`
		}


		const { status, data } = await User.createOAuth({ profilepic, name, email, username, facebookID, googleID }, regIPaddress)

		const user: any = data

		if(status == 'ok') {
			/* await */User.sendWelcomeEmail({ email, name, type: ' oauth '+oauth.oauthprovider })

			debug(`Welcome (OAuth) ${name}`)
			req.session.user = user
			req.session.auth = true
			const token = encodeURIComponent(cookie.sign(req.sessionID, COOKIE_SECRET))

			
			return res.json({ status: 'ok', data: { email, name: user.name, username: user.username, firstTime: user.firstTime, token, status: User.getStatus(user.damns), damns: 0 } })
		} else {
			return res.json({ status: 'error', data })
		}
	}

	// if here, normal registration

	const captcha = req.body['g-recaptcha-response']

	const result = await fetch(`https://www.google.com/recaptcha/api/siteverify?response=${captcha}&secret=${RECAPTCHA_SECRET}`, {
        method: 'GET'
    })

	const json = await result.json()
	
    if(json.success) {
        const { status, data } = await User.create({
            name,
            username,
            email,
			password,
			cpassword
        }, regIPaddress)
        if(status == 'ok' && typeof data != 'string') {
			const user: user = data
			
			debug(`Welcome (OAuth) ${name}`)
			req.session.user = user
			req.session.auth = true
			const token = encodeURIComponent(cookie.sign(req.sessionID, COOKIE_SECRET))

			res.json({ status: 'ok', data: { email, name: user.name, username: user.username, firstTime: user.firstTime, token, status: User.getStatus(user.damns), damns: 0 } })
	
			/* await */ User.sendWelcomeEmail({ email, name, type: `no oauth desktop` })
        } else {
            res.json({ status, data })
        }
    } else {

		const fromMobile = req.headers['x-requested-with'] === 'app'
		/* descriptive error for mobile applications. Captcha implemented on registrations on v1.11.0 */
		if(fromMobile) {
			res.json({status: "error", data: "Invalid captcha. If you see no captcha, please update your app." })
		} else {
			res.json({status: "error", data: "Invalid captcha" })
		}

	}
})

export default router