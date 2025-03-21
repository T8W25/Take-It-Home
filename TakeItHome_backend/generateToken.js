const jwt = require("jsonwebtoken");

// Replace this with actual user data
const payload = { id: "652f8e2b3c9d4a001c8e9b2a", email: "test@example.com" };

// Use the same JWT_SECRET from your .env file
const secret = "2ce7166bee98b90d60fbe3fb4810d4a7557d6c5ecf8a1fbb8c7412297b897002";

// Generate a token
const token = jwt.sign(payload, secret, { expiresIn: "1h" });
console.log("Generated Token:", token);

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MmY4ZTJiM2M5ZDRhMDAxYzhlOWIyYSIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTc0MjUzNDE0MSwiZXhwIjoxNzQyNTM3NzQxfQ.-aVFZRXyiT6tyFa6lghRbwYhSRzeMN9grRUGPw7PsNQ