const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 🛑 Validate Input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🛑 Check if User Already Exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create User without username
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username: email.split("@")[0], // Automatically generate username
    });

    await newUser.save();

    // ✅ Generate JWT Token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    console.log("✅ New user registered:", newUser);

    res.status(201).json({
      message: "Signup successful!",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
      token,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
