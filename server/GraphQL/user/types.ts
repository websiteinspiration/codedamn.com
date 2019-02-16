export default `
type RegistrationType {
	error: String
	data: User
}

type Userflow {
	done: [String!]!
	watched: [String!]!
}

type RedirectResponse {
	shouldRedirect: Boolean!,
	path: String
}

type User {
	progressBar: Float
	profilepic: String
	email: String
	name: String
	username: String
	firstTime: Boolean
	token: String
	status: String
	favtags: [String]
	damns: Int
	doj: String
	activeDates: [String]
	activeStreak: Int
}
`