import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import smsRoutes from './Routes/smsRoutes.js';
import matchRoutes from './Routes/matchRoutes.js';
app.use('/api/matches', matchRoutes);
import messagingRoutes from './Routes/messagingRoutes.js';
app.use('/messages', messagingRoutes);

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

app.use('/api/sms', smsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

