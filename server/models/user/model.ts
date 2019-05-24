import mongoose from 'mongoose'
import { user } from 'interfaces/user'

const noID = { _id: false }

const UserSchema = new mongoose.Schema({  
  name: String,
  fcmToken: String,
  damns: { type: Number, default: 0 },
  regIPaddress: { type: String, default: "127.0.0.1"},
  facebookID: String,
  completed: { type: [String], default: [] },
  practiceDone: { type: [String], default: [] },
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
  activeDates: { type: [String], default: [] },
  streak: { default: 0, type: Number }
}, { collection: 'users' })

const model = mongoose.model<user>('User', UserSchema)
export default model