import mongoose from 'mongoose'
import { statics } from '@interfaces/static'

const noID = { _id: false }

const StackSchema = new mongoose.Schema({  
	type: String,
	value: mongoose.Schema.Types.Mixed
}, { collection: 'statics' })

const model = mongoose.model<statics>('Static', StackSchema)
export default model