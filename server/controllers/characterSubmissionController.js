const CharacterSubmission = require("../Models/CharacterSubmission");

// Handle character submission
exports.submitCharacter = async (req, res) => {
  try {
    const { name, description, imageUrl, walletAddress, paymentTx } = req.body;

    // Ensure all fields are provided
    if (!name || !description || !imageUrl || !walletAddress) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const submission = new CharacterSubmission({
      name,
      description,
      imageUrl,
      walletAddress,
      paymentTx
    });

    await submission.save();

    res.status(201).json({
      message: "Character submitted successfully!",
      submission,
    });
  } catch (error) {
    console.error("Error submitting character:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

// Fetch all submissions (optional for admin panel)
exports.getAllSubmissions = async (req, res) => {
  try {
    const submissions = await CharacterSubmission.find().sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Fetch user submissions
exports.getUserSubmissions = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const submissions = await CharacterSubmission.find({ walletAddress });

    if (!submissions.length) {
      return res.status(404).json({ error: "No submissions found for this user." });
    }

    res.json(submissions);
  } catch (error) {
    console.error("Error fetching user submissions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};