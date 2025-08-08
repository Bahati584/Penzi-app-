import mongoose from 'mongoose';

const matchRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ageRange: {
    min: Number,
    max: Number,
  },
  town: String,
  createdAt: { type: Date, default: Date.now }
}, { collection: 'matchRequests' });

export default mongoose.model('MatchRequest', matchRequestSchema);
