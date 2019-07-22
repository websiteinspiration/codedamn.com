//import Community from './community'
import User from './user'
import Learn from './learn'
import Community from './community'
import System from './system'
import Practice from './practice'
import Payments from './payments'

const { buildSchema } = require('graphql')

const resolver = {
	...Community.resolvers,
	...User.resolvers,
	...Learn.resolvers,
	...System.resolvers,
	...Practice.resolvers,
	...Payments.resolvers
}

const schemaString = `

${User.types}
${Learn.types}
${Community.types}
${System.types}
${Practice.types}
${Payments.types}

type RootQuery {
	${User.queries}
	${Learn.queries}
	${Community.queries}
	${Practice.queries}
	${Payments.queries}
}

type RootMutation {
	${User.mutations}
	${Learn.mutations}
	${System.mutations}
	${Practice.mutations}
	${Payments.mutations}
}

schema {
	query: RootQuery
	mutation: RootMutation
}
`

const schema = buildSchema(schemaString)

export { resolver, schema }