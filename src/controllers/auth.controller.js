const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER USER
async function registerUser(req, res) {
    try {
        const { fullName: { firstName, lastName }, email, password } = req.body;

        // Check if user already exists
        const isUserAlreadyRegistered = await userModel.findOne({ email });
        if (isUserAlreadyRegistered) {
            return res.status(400).json({ message: "User already registered" });
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await userModel.create({
            fullName: { firstName, lastName },
            email,
            password: hashPassword
        });

        // Create JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Set token in cookie
        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        // Send response
        res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName
            }
        });

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

// LOGIN USER
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

// EXPORT BOTH FUNCTIONS
module.exports = {
    registerUser,
    loginUser
};
