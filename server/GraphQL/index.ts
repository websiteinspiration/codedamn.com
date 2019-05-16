//import Community from './community'
import User from './user'
import Learn from './learn'
import Community from './community'
import System from './system'
import Practice from './practice'

const { buildSchema } = require('graphql') // TODO: UNABLE TO CONVERT TO IMPORT!!

const resolver = {
	...Community.resolvers,
	...User.resolvers,
	...Learn.resolvers,
	...System.resolvers,
	...Practice.resolvers
}

const schema = buildSchema(`

${User.types}
${Learn.types}
${Community.types}
${System.types}

${Practice.types}

type RootQuery {
	${User.queries}
	${Learn.queries}
	${Community.queries}
	${Practice.queries}
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