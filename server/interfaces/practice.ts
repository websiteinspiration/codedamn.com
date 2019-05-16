import mongoose from "mongoose"

interface ChallengeType {
	text: string,
	testString: string
}

interface flowType {
	title: string,
	description: string,
	challenges: [ChallengeType],
	defaultValue: string,
	type: string,
	slug: string,
	nextslug: string
}

export default interface practice extends mongoose.Document {
	category: string,
	flow: [flowType]
}