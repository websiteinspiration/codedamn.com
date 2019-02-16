import xdebug from 'debug'
import Joi from 'joi'
import * as cookie from 'cookie-signature'
const debug = xdebug('cd:AuthMiddleware')

const { COOKIE_SECRET } = process.env

const signedCookieSchema = Joi.string().required()

/**
 * 
 * @param req express req object
 * @param res express res object
 * @param next moving to next middleware
 * @summary Silently injects user into express session if coming from mobile
 */
function auth(req, res, next) {
	const { error, value } = Joi.validate(req.headers['x-access-token'], signedCookieSchema)

	if(error) {
		// not authenticated OR already authenticated through browser cookie
		return next()
	}


	const verification = cookie.unsign(decodeURIComponent(value), COOKIE_SECRET)

	if(!verification || verification !== value.split('.')[0]) {
		// user is not legit. the cookie fails cryptographic check | Most probably user is on old app version
		return next()
	}

	debug(`Injecting cookie manually`)

	req.headers['x-access-token'] = undefined // treat as a session based user

	req.headers['x-source'] = 'mobile_'+COOKIE_SECRET // verifies that the user is coming from mobile

	if(req.headers.cookie == 'null' || !req.headers.cookie) {
		req.headers.cookie = `connect.sid=s%3A${value};` // TODO: POSSIBLE CLRF? Not really
	} else {
		req.headers.cookie += `;connect.sid=s%3A${value};` // TODO: POSSIBLE CLRF? Not really
	}

	next()
}

export default auth