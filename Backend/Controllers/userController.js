import User from '../Models/Users.js';
import Message from "../Models/Messages.js";

// Step 1: Register user (now phone comes from message text)
export const createUser = async (req, res) => {
  try {
    const { name, age, gender, county, town, phone } = req.body;

    if (!name || name.length < 2) {
      return res.status(400).json({ error: "Name must be at least 2 characters long" });
    }
    if (!age || isNaN(age) || age < 18) {
      return res.status(400).json({ error: "Age must be 18 or above" });
    }
    if (!["Male", "Female"].includes(gender)) {
      return res.status(400).json({ error: "Gender must be Male or Female" });
    }
    if (!county || !town) {
      return res.status(400).json({ error: "County and Town are required" });
    }
    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ error: "Phone must be a 10-digit number" });
    }

    // ✅ Check if phone already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: "This phone number is already registered", 
        user: existingUser 
      });
    }

    // Otherwise create new user
    const newUser = new User({ name, age, gender, county, town, phone });
    await newUser.save();

    res.status(201).json({ 
      success: true,
      message: "User created successfully", 
      user: newUser 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error creating user",
      error: error.message 
    });
  }
};
    
// Update user details from API (phone now comes from message text)
export const updateUserDetails = async (req, res) => {
  try {
    const { text } = req.body; // Remove phone from request body

    if (!text) {
      return res.status(400).json({ error: "Text message is required" });
    }

    // Parse phone and details from text message
    const parts = text.split("#");
    if (parts.length < 7) {
      return res.status(400).json({ error: "Invalid format. Use: details#phone#education#profession#maritalStatus#religion#ethnicity" });
    }

    const phone = parts[1]; // Extract phone from message
    const levelOfEducation = parts[2];
    const profession = parts[3];
    const maritalStatus = parts[4];
    const religion = parts[5];
    const ethnicity = parts[6];

    // Validate phone number
    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ error: "Valid 10-digit phone is required" });
    }

    // Log SMS
    await new Message({ phone, text, type: "details" }).save();

    if (!levelOfEducation) return res.status(400).json({ error: "Level of education is required" });
    if (!profession) return res.status(400).json({ error: "Profession is required" });

    const updatedUser = await User.findOneAndUpdate(
      { phone },
      { levelOfEducation, profession, maritalStatus, religion, ethnicity },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ 
      message: "Details updated successfully", 
      user: updatedUser 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating details', 
      error: error.message 
    });
  }
};

// Add self description via API (phone now comes from message text)
export const addSelfDescription = async (req, res) => {
  try {
    const { text } = req.body; // Remove phone from request body

    if (!text) {
      return res.status(400).json({ error: "Text message is required" });
    }

    // Parse phone and description from text message
    const parts = text.split("#");
    if (parts.length < 3) {
      return res.status(400).json({ error: "Invalid format. Use: myself#phone#description" });
    }

    const phone = parts[1]; // Extract phone from message
    const description = parts.slice(2).join(" "); // Combine remaining parts as description

    // Validate phone number
    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ error: "Valid 10-digit phone is required" });
    }
    if (!description || description.length < 60) {
      return res.status(400).json({ error: "Description must be at least 60 characters long" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { phone },
      { description },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ 
      success: true,
      message: "Description added successfully", 
      user: updatedUser 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error adding description",
      error: error.message 
    });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.status(200).json({
      success: true,
      user: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

// Get user by phone number
export const getUserByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.status(200).json({
      success: true,
      user: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ 
      success: true,
      message: 'User deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error deleting user',
      error: error.message 
    });
  }
};