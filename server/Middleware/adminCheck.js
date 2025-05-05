// adminCheck.js
const User = require('../Models/User');

exports.verifyAdminStatus = async (req, res, next) => {
  try {
    const walletAddress = req.headers["wallet-address"]; // Or wherever you pass the wallet address

    if (!walletAddress) {
      return res.status(400).json({ error: "Wallet address is required." });
    }

    const user = await User.findOne({ walletAddress });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    // User is admin, continue
    next();
  } catch (error) {
    console.error("Error verifying admin status:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};