import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: String,
  age: Number,
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  county: String,
  town: String,


  levelOfEducation: String,
  profession: String,
  maritalStatus: String,
  religion: String,
  ethnicity: String,


  selfDescription: String,


  liked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  rejected: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  registrationStage: {
    type: String,
    enum: [
      'awaiting_basic_info',
      'awaiting_details',
      'awaiting_self_description',
      'registered'
    ],
    default: 'awaiting_basic_info'
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
}, { collection: 'User details' }); 

export default mongoose.model('User', userSchema);
