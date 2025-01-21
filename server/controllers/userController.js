const User = require('../Models/User');

exports.checkUserRole = async (req, res) => {
    try {

        
        const { walletAddress } = req.body;

        if (!walletAddress) {
            return res.status(400).json({ error: "Wallet address is required" });
        }

        // Fetch user role
        const user = await User.findOne({ walletAddress });

        // Check if the user is an admin
        const isAdmin = user && user.role === "admin";

        res.json({ isAdmin }); // Return true if admin, otherwise false
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};