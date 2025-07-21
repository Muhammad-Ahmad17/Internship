const User = require('../models/user.model');
const { sendEmail } = require('../services/mail.service');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');


exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, balance } = req.body;
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash the password 
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user
        const user = new User({ name, email, password: hashedPassword , balance });
        await user.save();
        // Trigger other action (e.g., send email)
        await axios.post('http://localhost:5000/api/users/send-welcome-email', {
            email,
            name,
        });
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                name: user.name,
                email: user.email,
                password: user.password,
                balance: user.balance
            }
        });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.userProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.userLocation = async (req, res) => {
    // Fetch the user's IP address
    // Use a third-party service to get the location based on IP
    const ipResponse = await axios.get('https://api.ipify.org?format=json')
    const ip = ipResponse.data.ip;
    try {
        // Use a service like ipapi to get location details
        const response = await axios.get(`https://ipapi.co/${ip}/json/`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching location:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


exports.sendWelcomeEmail = async (req, res) => {
    const { email, name } = req.body;
    try {
        await sendEmail(email, 'Welcome!', `Hello ${name}, thank you for signing up!`);
        res.json({ message: 'Email sent' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send email' });
    }
};

exports.sendMoney = async (req, res) => {
  const { amount, recipientEmail } = req.body;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1. Find sender
    const sender = await User.findById(req.user.id).session(session);
    if (!sender) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Sender not found' });
    }

    // 2. Find recipient
    const recipient = await User.findOne({ email: recipientEmail }).session(session);
    if (!recipient) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Recipient not found' });
    }

    // 3. Check sender balance
    if (sender.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // 4. Perform the updates
    sender.balance -= amount;
    recipient.balance += amount;

    await sender.save({ session });
    await recipient.save({ session });

    // 5. Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.json({ message: 'Money sent successfully' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Transaction error:', error);
    res.status(500).json({ message: 'Failed to send money' });
  }
};
