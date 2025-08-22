import User from '../Models/Users.js';
import Message from '../Models/Messages.js';

export const createOrUpdateUserFromSMS = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.toUpperCase().startsWith('PENZI#')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid format. Use PENZI#phone#name#age#gender#county#town'
      });
    }

    const parts = text.trim().split('#');
    if (parts.length !== 7) {
      return res.status(400).json({
        success: false,
        message: 'Invalid format. Use PENZI#phone#name#age#gender#county#town. Example: PENZI#0722000000#John Doe#26#Male#Nakuru#Naivasha'
      });
    }

    const [, phone, name, age, gender, county, town] = parts;

    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ 
        success: false,
        message: "Valid 10-digit phone number is required. Example: 0722000000" 
      });
    }

    // Save the incoming message
    await new Message({ phone, text, type: "registration" }).save();

    // Create or update user
    const user = await User.findOneAndUpdate(
      { phone },
      { name, age:Number(age), gender, county, town, registrationStage: "awaiting_details" },
      { new: true, upsert: true } // create new if not exists
    );

    res.status(200).json({
      success: true,
      message: `Your profile has been created successfully ${name}. SMS details#phone#education#profession#maritalStatus#religion#ethnicity. Example: details#${phone}#diploma#driver#single#christian#mijikenda`,
      user
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error processing registration', 
      error: error.message 
    });
  }
};


// Update user details from SMS (details#phone#education#profession#maritalStatus#religion#ethnicity)
export const updateUserDetailsFromSMS = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.toUpperCase().startsWith('DETAILS#')) {
      return res.status(400).json({
        message: 'Invalid format. Use details#phone#education#profession#maritalStatus#religion#ethnicity'
      });
    }

    const parts = text.split('#');
    if (parts.length !== 7) {
      return res.status(400).json({
        message: 'Invalid format. Use details#phone#education#profession#maritalStatus#religion#ethnicity'
      });
    }

    const [, phone, education, profession, maritalStatus, religion, ethnicity] = parts;

    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ error: "Valid 10-digit phone is required" });
    }

    await new Message({ phone, text, type: "details" }).save();

    const updatedUser = await User.findOneAndUpdate(
      { phone },
      { 
        education, 
        profession, 
        maritalStatus, 
        religion, 
        ethnicity,
        registrationStage: 'awaiting_description'
      },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ error: "User not found. Please register first." });

    res.status(200).json({ 
      message: "This is the last stage of registration. SMS a brief description of yourself to starting with MYSELF#phone#description. E.g., MYSELF#0722000000#chocolate, lovely, sexy etc.",
      user: updatedUser 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating details', error: error.message });
  }
};

// Add self description from SMS (MYSELF#phone#description)
export const addDescriptionFromSMS = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.toUpperCase().startsWith('MYSELF#')) {
      return res.status(400).json({
        message: 'Invalid format. Use MYSELF#phone#description'
      });
    }

    const parts = text.split('#');
    if (parts.length < 3) {
      return res.status(400).json({
        message: 'Invalid format. Use MYSELF#phone#description'
      });
    }

    const [, phone, ...descriptionParts] = parts;
    const description = descriptionParts.join(' ');

    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ error: "Valid 10-digit phone is required" });
    }

    await new Message({ phone, text, type: "description" }).save();

    if (!description || description.length < 10) {
      return res.status(400).json({ error: "Description must be at least 10 characters long" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { phone },
      { 
        description: description,
        registrationStage: 'complete',
        isActive: true
      },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ error: "User not found. Please register first." });

    res.status(200).json({ 
      message: "You are now registered for dating. To search for a MPENZI, SMS match#phone#age-range#town and meet the person of your dreams. E.g., match#0722000000#23-25#Nairobi",
      user: updatedUser 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding description', error: error.message });
  }
};

// Get all messages
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
};

// Get message by ID
export const getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching message',
      error: error.message
    });
  }
};

// Delete message
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting message',
      error: error.message
    });
  }
};

export const processSMSCommand = async (req, res) => {
  try {
    const { phone, text } = req.body;
    const command = text.trim();
    
    // Log the message first
    await new Message({ phone, text, type: "command" }).save();

    if (command.toUpperCase().startsWith('PENZI#')) {
      return await createOrUpdateUserFromSMS({ body: { text } }, res);
    } else if (command.toUpperCase().startsWith('DETAILS#')) {
      return await updateUserDetailsFromSMS({ body: { text } }, res);
    } else if (command.toUpperCase().startsWith('MYSELF#')) {
      return await addDescriptionFromSMS({ body: { text } }, res);
    } else if (command.toUpperCase().startsWith('MATCH#')) {
      // Validate match format
      const parts = command.split('#');
      if (parts.length !== 4) {
        return res.status(400).json({
          success: false,
          message: 'Invalid format. Use: MATCH#phone#age-range#town (e.g., MATCH#0722000000#23-25#Nairobi)'
        });
      }
      return res.json({
        success: true,
        message: 'Match feature coming soon. Please complete your registration first.'
      });
    } else if (command === 'NEXT') {
      return res.json({
        success: true,
        message: 'No more matches available. Send a new MATCH request to find more partners.'
      });
    } else if (/^\d{10}$/.test(command)) {
      return res.json({
        success: true,
        message: 'Phone number lookup feature coming soon. Please use MATCH command to find partners.'
      });
    } else if (command.toUpperCase().startsWith('DESCRIBE#')) {
      const parts = command.split('#');
      if (parts.length !== 2 || !/^\d{10}$/.test(parts[1])) {
        return res.status(400).json({
          success: false,
          message: 'Invalid format. Use: DESCRIBE#phone (e.g., DESCRIBE#0722000000)'
        });
      }
      return res.json({
        success: true,
        message: 'User description feature coming soon. Complete your registration first.'
      });
    } else if (command.toUpperCase() === 'YES') {
      return res.json({
        success: true,
        message: 'Confirmation received. The other party will be notified.'
      });
    } else {
      // For invalid commands, return specific error message
      return res.status(400).json({
        success: false,
        message: 'Invalid command. Available commands: PENZI#, DETAILS#, MYSELF#, MATCH#, NEXT, DESCRIBE#, YES, or a phone number'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing SMS command',
      error: error.message
    });
  }
};