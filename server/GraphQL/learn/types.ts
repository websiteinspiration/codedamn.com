
export default `

type CommentType {
	author: String!,
	id: String!,
	date: String!,
	avatar: String,
	comment: String!,
	upvotes: Int,
	downvotes: Int
}

type DotInfo {
	comments: [CommentType!]!
	currentTitle: String!
	currentSlug: String!
	displayLangName: String!
	videoExtras: VideoType
	quizExtras: QuizType
	nextTitle: String
	nextURL: String
	prevTitle: String
	prevURL: String
	type: String!
}

type VideoType {
	vidid: String
}

type QuizOptionType {
	text: String!
	correct: Boolean!
}

type QuizType {
	author: String!
	category: String!
	code: String
	options: [QuizOptionType!]!
	question: String!
	slug: String!
	subcategory: String!
}

type TimelineFlow {
	title: String,
	slug: String,
	type: String,
	extras: VideoType,
	score: Float!,
	reviews: [String],
	comments: [CommentType]
}

type Timeline {
	id: ID!
	category: String!
	description: String!
	icon: String!
	name: String!
	tags: [String!]!
	views: Int!
	slug: String!
	flow: [TimelineFlow!]!
}

type LearnBlock {
	name: String!
	timelines: [Timeline!]!
	score: Int!
}
`