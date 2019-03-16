import mongoose from "mongoose"

interface OptionType {
	text: string,
	correct: boolean
}

export default interface quiz extends mongoose.Document {
	code: string,
	options: [OptionType],
	question: string,
	author: string,
	category: string,
	subcategory: string,
	slug: string
}