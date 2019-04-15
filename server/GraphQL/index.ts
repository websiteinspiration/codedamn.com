//import Community from './community'
import User from './user'
import Learn from './learn'
import Community from './community'
import System from './system'

const { buildSchema } = require('graphql') // UNABLE TO CONVERT TO IMPORT!!

const resolver = {
	...Community.resolvers,
	...User.resolvers,
	...Learn.resolvers,
	...System.resolvers
}

const schema = buildSchema(`

${User.types}
${Learn.types}
${Community.types}
${System.types}

type RootQuery {
	${User.queries}
	${Learn.queries}
	${Community.queries}
}

type RootMutation {
	${User.mutations}
	${Learn.mutations}
	${System.mutations}
}

schema {
	query: RootQuery
	mutation: RootMutation
}
`)

export { resolver, schema }