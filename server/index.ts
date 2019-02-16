
import express from 'express'
import * as path from 'path'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import * as bodyParser from 'body-parser'
import session from 'express-session'
import routes from './controllers'
import Store from 'connect-mongo'
import mongoose from 'mongoose'
import csp from 'helmet-csp'
import graphqlHttp from 'express-graphql'
import * as Sentry from '@sentry/node'

// configure environment variables
import dotenv from 'dotenv'

dotenv.config({
	path: path.resolve(__dirname, '../.env')
})

import cspRules from './config/csp'
import { resolver, schema } from './GraphQL'


const { COOKIE_SECRET, DB_CONNECTION_STRING, NODE_ENV, PORT } = process.env
/* To support GraphQL ObjectID -> String conversion */

mongoose.Types.ObjectId.prototype.valueOf = function () {
	return this.toString()
}

/* To support GraphQL ObjectID -> String conversion */

NODE_ENV === 'production' && Sentry.init({
	maxBreadcrumbs: 50,
	debug: true,
	environment: NODE_ENV || 'localhost',
	dsn: 'https://00db8a7d63ca47ee8784159f25ad4544@sentry.io/1256239',
	release: require('../package.json').version
})

;(async () => {
	const app = express()
	
	console.log(COOKIE_SECRET)
	app.use(Sentry.Handlers.requestHandler())

    mongoose.connect(DB_CONNECTION_STRING)
	const MongoStore = Store(session)
	
	if(NODE_ENV !== 'production') {
		// assets
		app.use('/assets', express.static(path.join(__dirname, 'frontend/compiled/assets')))
	}

    const domain = NODE_ENV === 'production' ? 'codedamn.com' : 'localhost'
	
	app.use(require('middlewares/auth').default)

    app.use(session({
        secret: COOKIE_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: 'auto', domain, maxAge: 183 * 24 * 60 * 60 * 1000, httpOnly: true }, // secure cookies on HTTPS (prod) ; insecure on HTTP (dev)
        store: new MongoStore({ mongooseConnection: mongoose.connection })
	}))

	app.use(require('middlewares/rewards').default)

	NODE_ENV === 'production' && app.use(csp(cspRules))

    app.use(bodyParser.json()) // 
    app.use(bodyParser.urlencoded({ extended: false })) // parsing POST data

    app.use(helmet())

    app.use(cookieParser(COOKIE_SECRET)) // signing and parsing cookies

	app.use(function(req, res, next) {
		if(req.url == "/graphql") {
			res.header("Access-Control-Allow-Origin", "https://learn.codedamn.com")
			res.header('Access-Control-Allow-Credentials', "true")
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")	
			if (req.method === 'OPTIONS') {
				return res.sendStatus(200)
			}
		}
		next()
	})

	app.use('/graphql', graphqlHttp({
		schema,
		rootValue: resolver,
		graphiql: NODE_ENV !== 'production',
		formatError: error => {
			
			const errorObj = {
				message: error.message,
				locations: error.locations,
				path: error.path
			}

			Sentry.captureMessage(JSON.stringify(errorObj))
			
			return errorObj
		}
	}))

	routes(app) // register routes

	app.use(Sentry.Handlers.errorHandler())
	app.listen(PORT, _ => console.log(`Server listening on ${PORT}`))
})()