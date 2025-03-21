

const jwt = require('jsonwebtoken');

// Middleware to authenticate the user
exports.authenticate = (req, res, next) => {
    try {
        // Extract the token from the Authorization header
        const authHeader = req.headers['authorization'];
        
        // Debug log: Print the Authorization header
        console.log("Authorization Header:", authHeader);

        // Check if the Authorization header exists and is properly formatted
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.error("No token provided or invalid format"); // Debug log
            return res.status(401).json({ message: 'No token provided or invalid format' });
        }

        // Extract the token (remove "Bearer " prefix)
        const token = authHeader.split(' ')[1];

        // Debug log: Print the extracted token
        console.log("Extracted Token:", token);

        // Verify the token using the JWT_SECRET from the environment variables
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error("Token Verification Error:", err.message); // Debug log
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({ message: 'Token expired. Please log in again.' });
                }
                if (err.name === "JsonWebTokenError") {
                    return res.status(403).json({ message: 'Invalid token. Please log in again.' });
                }
                return res.status(403).json({ message: 'Failed to authenticate token' });
            }

            // Attach the decoded user data to the request object
            req.user = decoded;

            // Debug log: Print the decoded user data
            console.log("Decoded User Data:", decoded);

            // Proceed to the next middleware/route handler
            next();
        });
    } catch (error) {
        console.error("Authentication Middleware Error:", error.message); // Debug log
        return res.status(500).json({ message: 'Internal server error' });
    }
};
