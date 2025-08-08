import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  toPhone: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['reply', 'match_info', 'describe', 'confirmation'],
    default: 'reply',
  },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'Notification and sms log' }); 

export default mongoose.model('Notification', notificationSchema);
