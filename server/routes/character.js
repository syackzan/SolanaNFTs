const express = require("express");
const { submitCharacter, getAllSubmissions, getUserSubmissions } = require("../controllers/characterSubmissionController");

const router = express.Router();

// Submit a new character
router.post("/submit", submitCharacter);

// Get all submissions (for admin panel)
router.get("/all", getAllSubmissions);

// Get user submissions
router.get("/:walletAddress", getUserSubmissions);

module.exports = router;
