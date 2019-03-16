import mongoose from 'mongoose'
import quiz from 'interfaces/quiz'

const shortid = require('shortid')

const noID = { _id: false }

const OptionType = new mongoose.Schema({
	text: String,
	correct: Boolean
}, noID)

const QuizSchema = new mongoose.Schema({  
	code: { type: String, default: null },
	options: [OptionType],
	question: String,
	author: String,
	category: String,
	subcategory: String,
	slug: { type: String, default: shortid.generate }
}, { collection: 'quizzes' })

const model = mongoose.model<quiz>('Quiz', QuizSchema)
export default model