const mongoose = require("mongoose");

const CharacterSubmissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 500, // Limit description length
    },
    imageUrl: {
      type: String,
      required: true,
    },
    walletAddress: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    paymentTx: {
        type: String,
        required: true
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CharacterSubmission", CharacterSubmissionSchema);