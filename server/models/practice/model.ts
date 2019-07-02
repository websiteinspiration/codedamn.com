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
	headScript: String,
	tailScript: String,
	type: String,
	slug: String,
	nextslug: String,
	mode: { type: String, default: "normal" }
})

const PracticeSchema = new mongoose.Schema({  
  category: String,
  flow: [FlowType],
  title: String,
  slug: String,
  image: String,
  desc: String
}, { collection: 'practice' })

const model = mongoose.model<practice>('Practice', PracticeSchema)
export default model