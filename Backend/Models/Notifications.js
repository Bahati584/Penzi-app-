import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  toPhone: { type: String, required: true },
  message: { type: String, required: true },
  type: String
}, { timestamps: true, collection: 'Notification and sms log' });

export default mongoose.model('Notification', notificationSchema);
