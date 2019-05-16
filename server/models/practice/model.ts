import mongoose from 'mongoose'
import practice from 'interfaces/practice'


const ChallengeType = new mongoose.Schema({
	text: String,
	testString: String
})

const FlowType = new mongoose.Schema({
	title: String,
	description: String,
	challenges: [ChallengeType],
	defaultValue: String,
	type: String,
	slug: String,
	nextslug: String
})

const PracticeSchema = new mongoose.Schema({  
  category: String,
  flow: [FlowType]
}, { collection: 'practice' })

const model = mongoose.model<practice>('Practice', PracticeSchema)
export default model