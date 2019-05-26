export default `
type ChallengeBlockType {
	text: String!
	testString: String!
}

type PracticeBlock {
	title: String!
	description: String!
	challenges: [ChallengeBlockType]
	defaultValue: String
	headScript: String
	tailScript: String
	type: String
	slug: String!
	nextslug: String
	mode: String
}
`