import mongoose from 'mongoose'
import { user } from '@interfaces/user'

const noID = { _id: false }

const LanguageInfo = new mongoose.Schema({
	language: String,
	watched: [String]
}, noID)

const TasksInfo = new mongoose.Schema({
	language: String,
	done: [String]
}, noID)

const StackInfo = new mongoose.Schema({
	stack: String,
	done: [String]
}, noID)

const dataSchema = new mongoose.Schema({
	doneDots: mongoose.Schema.Types.Mixed, // doneDots: { *: [string] }
	watchDots: mongoose.Schema.Types.Mixed,
	taskDoneDots: mongoose.Schema.Types.Mixed
}, noID)

const UserSchema = new mongoose.Schema({  
  name: String,
  fcmToken: String,
  damns: { type: Number, default: 0 },
  regIPaddress: { type: String, default: "127.0.0.1"},
  facebookID: String,
  googleID: String,
  profilepic: { type: String, default: 'https://codedamn.com/assets/images/avatar.jpg' },
  username: String,
  email: String,
  votedComments: [String],
  doj: { type: Date, default: Date.now },
  password: String,
  favtags: {type: [String], default: []},
  firstTime: { type: Boolean, default: true },
  level: { type: String, default: "0" },
  civilization: { type: Number, default: 0.7 },
  access: { type: String, default: "member" }, // [member, moderator, admin]
  data: dataSchema,
  activeDates: [String],
  streak: { default: 0, type: Number }
}, { collection: 'users' })

const model = mongoose.model<user>('User', UserSchema)
export default model