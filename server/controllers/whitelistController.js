const WhitelistSubmission = require("../Models/Whitelist.js");

exports.getWhitelistAddresses = async (req, res) => {
  try {
    // Fetch all whitelist addresses from the database
    const whitelistAddresses = await WhitelistSubmission.find({});

    // Return success response
    res.status(200).json({
      message: "Whitelist addresses retrieved successfully",
      count: whitelistAddresses.length,
      whitelistAddresses,
    });
  } catch (error) {
    console.error("Error fetching whitelist addresses:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};


// Handle whitelist submission
exports.submitAddress = async (req, res) => {
  try {
    const { address, email, x } = req.body;

    // Ensure all fields are provided
    if (!address) {
      return res.status(400).json({ error: "Address is required." });
    }

    // Check if the total number of submissions has reached the limit (30)
    const submissionCount = await WhitelistSubmission.countDocuments();
    if (submissionCount >= 30) {
      return res.status(403).json({ error: "Whitelist is full. No more submissions allowed." });
    }

    // Check if the address already exists
    const existingSubmission = await WhitelistSubmission.findOne({ address });

    if (existingSubmission) {
      return res.status(409).json({ error: "Address already submitted." }); // HTTP 409: Conflict
    }

    // If address does not exist, create a new submission
    const submission = new WhitelistSubmission({ address, email, x });
    await submission.save();

    res.status(201).json({
      message: "Wallet submitted successfully!",
      submission,
    });
  } catch (error) {
    console.error("Error submitting character:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};
