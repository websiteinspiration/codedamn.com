import mongoose from 'mongoose'

// deprecated

const Schema = new mongoose.Schema({
	title: String,
	body: String,
	image: String
}, { collection: 'dews'})

const model = mongoose.model('dews', Schema)

export default model