const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
            fullName: {
                firstName,
                lastName
            },
            email,
            password
        });

        return res.status(201).json({ message: "User registered successfully", user });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(201).json({
        message: "User registered successfully",
        user: {
            email: user.email,
            _id: user._id,
            fullName: user.fullName
        }
    })
}


module.exports = {
    registerUser
};