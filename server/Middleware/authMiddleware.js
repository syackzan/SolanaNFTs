

// authMiddleware.js
exports.verifyApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key']; // Custom header for the API key
    // console.log(apiKey);
    // console.log(process.env.API_KEY);
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return res.status(403).json({ message: 'Forbidden: Invalid API key' });
    }
    next();
  };