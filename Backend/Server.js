import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';  // ✅ Add CORS for frontend communication
import adminRoutes from './Routes/adminRoutes.js';
import smsRoutes from './Routes/smsRoutes.js';
import matchRoutes from './Routes/matchRoutes.js';
import userRoutes from './Routes/userRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());  // ✅ Enable CORS for frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/sms', smsRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running', 
    timestamp: new Date().toISOString() 
  });
});

const mongoURI = process.env.MONGO_URI || process.env.mongodb_uri;

if (!mongoURI) {
  console.error("MongoDB URI is not defined in environment variables");
  process.exit(1);
}

console.log("Connecting to MongoDB...");

// Connect to MongoDB
mongoose.connect(mongoURI)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


