//import Community from './community'
import User from './user'
//import Learn from './learn'

const { buildSchema } = require('graphql') // UNABLE TO CONVERT TO IMPORT!!

const resolver = {
//	...Community.resolvers,
	...User.resolvers,
//	...Learn.resolvers
}

const schema = buildSchema(`

${User.types}

type RootQuery {
	${User.queries}
}

type RootMutation {
	${User.mutations}
}

schema {
	query: RootQuery
	mutation: RootMutation
}
`)

export { resolver, schema }