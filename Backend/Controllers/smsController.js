// Controllers/smsController.js
import User from '../Models/Users.js';

export const handleIncomingSMS = async (req, res) => {
  try {
    const from = req.body.from?.trim();
    const text = req.body.text?.trim();

    console.log(`📩 Incoming SMS -> From: ${from}, Text: ${text}`);

    if (!from || !text) {
      return res.status(400).json({ error: "Missing 'from' or 'text' field" });
    }

    // Step 1: PENZI keyword — start registration
    if (text.toUpperCase() === 'PENZI') {
      let user = await User.findOne({ phone: from });

      if (!user) {
        user = new User({ phone: from });
        await user.save();
        console.log("✅ New user saved to DB:", user);
        return res.status(200).send('Welcome to LoveMatch! Reply with your name to get started.');
      }

      console.log("ℹ️ Returning user found:", user.phone);
      return res.status(200).send('Welcome back! Continue from where you left off.');
    }

    // Step 2: Fetch user
    let user = await User.findOne({ phone: from });
    if (!user) {
      return res.status(200).send('Please start by texting PENZI to join LoveMatch.');
    }

    // Step 3: Step-by-step registration
    if (!user.name) {
      user.name = text;
      await user.save();
      console.log("✏️ Saved name:", user.name);
      return res.status(200).send(`Hi ${user.name}! How old are you?`);
    }

    if (!user.age) {
      const ageNum = parseInt(text, 10);
      if (isNaN(ageNum)) {
        return res.status(200).send('Please enter a valid age (numbers only).');
      }
      user.age = ageNum;
      await user.save();
      console.log("✏️ Saved age:", user.age);
      return res.status(200).send('Great! What are you looking for in a match?');
    }

    if (!user.preference) {
      user.preference = text;
      await user.save();
      console.log("✏️ Saved preference:", user.preference);
      return res.status(200).send('Thanks! Your profile is now complete. Reply MATCH to find matches.');
    }

    // Step 4: Default reply
    return res.status(200).send('Profile already complete. Reply MATCH to see potential matches.');

  } catch (error) {
    console.error("❌ Error handling SMS:", error);
    return res.status(500).send('Server error. Please try again later.');
  }
};
 