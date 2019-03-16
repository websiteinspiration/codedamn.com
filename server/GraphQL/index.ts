//import Community from './community'
import User from './user'
import Learn from './learn'
import Community from './community'

const { buildSchema } = require('graphql') // UNABLE TO CONVERT TO IMPORT!!

const resolver = {
	...Community.resolvers,
	...User.resolvers,
	...Learn.resolvers
}

const schema = buildSchema(`

${User.types}
${Learn.types}
${Community.types}

type RootQuery {
	${User.queries}
	${Learn.queries}
	${Community.queries}
}

type RootMutation {
	${User.mutations}
	${Learn.mutations}
}

schema {
	query: RootQuery
	mutation: RootMutation
}
`)

export { resolver, schema }