import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import smsRoutes from './Routes/smsRoutes.js';
import matchRoutes from './Routes/matchRoutes.js';
import messagingRoutes from './Routes/messagingRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/sms', smsRoutes);
app.use('/api/matches', matchRoutes);
app.use('/messages', messagingRoutes);


console.log("Connecting to MongoDB at", process.env.MONGO_URI);

mongoose.connect(process.env.mongodb_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

.then(() => console.log('MongoDB connected'))
.catch(err => console.error("MongoDB connection error:", err));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



