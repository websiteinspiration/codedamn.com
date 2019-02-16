import Joi from 'joi'

const string = Joi.string().required()

export const oauthLogin = Joi.object().keys({
	id: string,
	oauthprovider: string.valid('facebook', 'google')
}).unknown(false).required()

export const redirectInfoSchema = Joi.object().keys({
	host: string.valid('learn', 'do'), 
	redirect: string, 
	hash: string
}).unknown(false).required()