

// authMiddleware.js
exports.verifyApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key']; // Custom header for the API key
    if (!apiKey || apiKey !== process.env.API_KEY) {
      console.log("ACCESS FORBIDDEN - RETURNING");
      return res.status(403).json({ message: 'Forbidden: Invalid API key' });
    }
    next();
  };