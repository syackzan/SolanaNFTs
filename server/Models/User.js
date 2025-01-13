const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    walletAddress: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ["admin", "member"],
        default: "member", // Default role is "member"
    },
});

module.exports = mongoose.model("User", userSchema, "roles");