import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2 },
  age: { type: Number, required: true, min: 18 },
  gender: { type: String, enum: ["Male", "Female"], required: true },
  county: { type: String, required: true },
  town: { type: String, required: true },
  phone: { type: String, required: true, unique: true, match: /^\d{10}$/ },
  levelOfEducation: { type: String },
  profession: { type: String },
  maritalStatus: { type: String },
  religion: { type: String },
  ethnicity: { type: String },
  description: { type: String },


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
  }
}, { timestamps: true, collection:'User details' });

export default mongoose.models.User || mongoose.model('User', userSchema);


