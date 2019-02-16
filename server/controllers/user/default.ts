import express from 'express'
import User from 'models/user'
import Dews from 'models/dews' // deprecated | Sept 7
import DevNews from 'models/devnews'
import Static from 'models/static'
import xdebug from 'debug'
import fetch from 'node-fetch'
import Joi from 'joi'

const router = express.Router()
const debug = xdebug('cd:panel')
import loggedIn from 'middlewares/loggedIn'

const { RECAPTCHA_SECRET, COOKIE_SECRET } = process.env

// Deprecated Sept 20, 2018 @ Mobile v1.8
async function sessionID2User(token, store): Promise<any> {

	const { error, value: sessionID } = Joi.validate(token, Joi.string().required())

	if (error) return { status: 'error', data: 'Invalid session ID' }

	return new Promise((resolve, reject) => {
		store.get(sessionID, (err, sess) => {
			// This attaches the session to the req.
			if (err) {
				return resolve({ status: 'error', data: err })
			}
			return resolve({ status: 'ok', data: sess })
			//return res.json({ status: 'ok', data: await Dews.getDews()})
		})
	})
}

router.get('/user/tags', loggedIn, async (req: any, res) => {


	if (req.session.auth) {
		const userfavtags = req.session.user.favtags
		const alltags = await Static.getAllTags()

		const finalData = alltags.map(tag => ({
			title: tag,
			marked: userfavtags.includes(tag)
		}))

		return res.json({ status: 'ok', data: finalData })
	}

	// Deprecated on Sept 20 2018 @ Mobile v1.8

	const mobiletoken = req.headers['x-access-token']
	const { status, data } = await sessionID2User(mobiletoken, req.sessionStore)

	if (status == 'error') {
		return res.json({ status: 'error', data: 'unauthorized' })
	}

	const userfavtags = data.user.favtags
	const alltags = await Static.getAllTags()

	const finalData = alltags.map(tag => ({
		title: tag,
		marked: userfavtags.includes(tag)
	}))

	return res.json({ status: 'ok', data: finalData })
})

router.post('/user/tags', loggedIn, async (req: any, res) => {

	if (req.session.auth) {
		const { error: e, value: { data: tags } } = Joi.validate(req.body, Joi.object().keys({
			data: Joi.array().items(Joi.string().required()).required()
		}).required())

		if (e) {
			return res.json({ status: 'error', data: 'Invalid tags' })
		}

		if (tags.length == 0) {
			return res.json({ status: 'error', data: 'At least 1 tag is required' })
		}

		const username = req.session.user.username

		const allowedTags = await Static.getAllTags()

		const tagSchema = allowedTags => {
			return Joi.array().items(Joi.valid(allowedTags))
		}

		const { error, value } = Joi.validate(tags, tagSchema(allowedTags))

		if (error) {
			debug(`User |${username}| tried to add tags which are not present in DB`)//, error, allowedTags)
			return res.json({ status: 'error', data: 'Invalid tags' })
		}

		req.session.user.favtags = value

		req.session.save()

		await User.saveTags(value, username)
		return res.json({ status: 'ok', data: 'Tags saved!' })
	}


	// Deprecated on Sept 20 2018 @ Mobile v1.8

	const mobiletoken = req.headers['x-access-token']

	if (!mobiletoken || typeof mobiletoken !== 'string') {
		return
	}

	const tags = (req.body || {}).data
	const { status, data } = await sessionID2User(mobiletoken, req.sessionStore)

	if (status == 'error') {
		return res.json({ status: 'error', data: 'unauthorized' })
	}

	if (tags.length == 0) {
		return res.json({ status: 'error', data: 'At least 1 tag is required' })
	}

	const username = data.user.username

	const allowedTags = await Static.getAllTags()

	const tagSchema = allowedTags => {
		return Joi.array().items(Joi.valid(allowedTags))
	}

	const { error, value } = Joi.validate(tags, tagSchema(allowedTags))

	if (error) {
		debug(`User |${username}| tried to add tags which are not present in DB`)
		return res.json({ status: 'error', data: 'Invalid tags' })
	}

	data.user.favtags = value
	req.sessionStore.set(mobiletoken, data, _ => _)

	await User.saveTags(value, username)
	return res.json({ status: 'ok', data: 'Tags saved!' })

})

router.post('/detailsordie', loggedIn, async (req, res) => {

	const { email, name, username } = req.session.user
	const damns = await User.getDamns(username)

	return res.json({
		status: "loggedIn",
		payload: { email, name, username, damns, status: User.getStatus(damns) }
	})
})

router.post('/request-csrf-token', async (req, res) => {
	const csrf = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
	req.session.csrfToken = csrf
	return res.json({ csrf })
})

router.post('/settings', loggedIn, async (req: any, res) => {

	debugger
	if (req.session.auth) {
		const csrfToken = req.body.csrf
		const mobile = req.headers['x-source'] === 'mobile_'+COOKIE_SECRET

		if (!csrfToken && !mobile) {
			// no CSRF and mobile token => only display data
			const data = await User.getSettings(req.session.user.username)
			return res.json(data)
		}

		if (req.session.csrfToken === csrfToken || mobile) { // cookie based session
			delete req.body.csrf
			delete req.body.email // no email change allowed
			const data = await User.saveSettings(req.body || {}, req.session.user.username)
			if (data.status === "ok") {
				if (req.body.username) {
					req.session.user.username = req.body.username
				}
			}
			req.session.csrfToken = null // destroy this CSRF token
			req.session.save()
			return res.json(data)
		} else {
			req.session.csrfToken = null // destroy this CSRF token
			req.session.save()
			return res.json({ status: 'error', data: 'Invalid CSRF/Auth Token' })
		}
	}



	// Deprecated on Sept 20 2018 @ Mobile v1.8

	// console.log(req.sessionID, )

	const csrfToken = req.body.csrf
	const mobiletoken = req.headers['x-access-token']
	//debugger

	if (!csrfToken && !mobiletoken) {
		// no CSRF or mobile token => only display data
		const data = await User.getSettings(req.session.user.username)
		return res.json(data)
	}

	if (req.session.csrfToken === csrfToken && req.session.csrfToken) { // desktop
		delete req.body.csrf
		delete req.body.email // no email change allowed
		const data = await User.saveSettings(req.body || {}, req.session.user.username)
		if (data.status === "ok") {
			if (req.body.username) {
				req.session.user.username = req.body.username
			}
			/*if(req.body.email) {
				req.session.user.email = req.body.email
			}*/
		}
		res.json(data)
	} else if (mobiletoken) {

		const { status, data: userSession } = await sessionID2User(mobiletoken, req.sessionStore)

		if (status == 'ok') {

			const data = await User.saveSettings(req.body || {}, userSession.user.username)
			if (data.status === "ok") {
				if (req.body.username) {
					userSession.user.username = req.body.username
					await userSession.save()
				}
			}
			return res.json(data)
		}

	} else {
		res.json({ status: 'error', data: 'Invalid CSRF/Auth Token' })
	}

	req.session.csrfToken = null // destroy this CSRF token

	// perform CSRF checks and update settings
})

router.post('/send-feedback', async (req, res) => {
	const { name, email, message, captcha }: any = req.body || {}
	//debugger

	if (req.headers['x-requested-with'] === 'app' /*&& (await sessionID2User(req.headers['x-access-token'], req.sessionStore)).status == 'ok'*/) { // TODO: UPGRADE THIS METHOD CALL FOR NEW APP USERS.
		debug(`Message from app`)
	} else {
		const result = await fetch(`https://www.google.com/recaptcha/api/siteverify?response=${captcha}&secret=${RECAPTCHA_SECRET}`, {
			method: 'GET'
		})


		const json = await result.json()

		if (!json.success) {
			return res.json({ status: "error", data: "Invalid captcha" })
		}

	}

	var Mailjet = require('node-mailjet').connect(process.env.MJ_API_PUBLICKEY, process.env.MJ_API_PRIVATEKEY)

	var options = {
		// From
		FromEmail: 'support@codedamn.com',
		FromName: name,
		// To
		Recipients: [{ Email: 'technotweaksteam@gmail.com' }],
		// Subject
		Subject: `Feedback From ${name} | ${email} | codedamn`,
		// Body
		'Text-part': message
	};

	try {
		var request = await Mailjet.post('send').request(options)
		//console.log(request)
		if (request) {
			return res.json({ status: "ok" })
		}

	} catch (e) {
		console.log(e)
		return res.json({ status: "error", data: "Failed to send email" })
	}


	return res.json({ status: "error" })
})


// @deprecated on Sept 7 2018
router.get('/dews', loggedIn, async (req: any, res) => {
	// TODO: better/clean implementation of this:

	if (req.headers.token || req.headers['x-access-token']) {

		const { status } = await sessionID2User(req.headers.token || req.headers['x-access-token'], req.sessionStore)

		if (status === 'ok') {
			return res.json({ status: 'ok', data: await Dews.getDews() })
		} else {
			return res.json({ status: 'error' })
		}
	}
})

router.get('/devnews', loggedIn, async (req: any, res) => {
	//const token = req.headers['x-access-token']
	//const { status, data } = await sessionID2User(token, req.sessionStore)
	//if(status === 'ok') {

	if (req.session.auth) {

		const userfavtags = req.session.user.favtags
		const userData = await DevNews.getDevNews(userfavtags, req.session.user.username)

		return res.json({ status: 'ok', data: userData })
	}


	// Deprecated Sept 20, 2018

	const token = req.headers['x-access-token']
	const { status, data } = await sessionID2User(token, req.sessionStore)

	if (status === 'ok' && data) {
		const userfavtags = data.user.favtags
		const userData = await DevNews.getDevNews(userfavtags, req.session.user.username)

		return res.json({ status: 'ok', data: userData })
	}

	//}

	return res.json({ status: 'error' })
})

router.post('/damn-table', loggedIn, async (req, res) => {


	if (!req.session.user) {
		console.log(`AT DAMN-TABLE PREVENTED A FATAL SERVER CRASH: `, req.session)
		return res.json({ status: 'error', data: [], selfRank: 0 })
	}

	const damns = req.session.user.damns

	const data = await User.getDamnList()
	const selfRank = await User.getUserRank(damns)

	return res.json({ status: 'ok', data, selfRank }) // TODO: Fix this irregular response pattern by integrating this into API version
})

export default router