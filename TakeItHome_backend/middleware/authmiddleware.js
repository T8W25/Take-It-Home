const jwt = require('jsonwebtoken');  

// Middleware to authenticate the user
exports.authenticate = (req, res, next) => {
    // Extract the token
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Failed to authenticate token' });
        req.user = decoded; 
        next();
    });
};