const mongoose = require("mongoose");

const WhitelistSubmissionSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      unique: true
    },
    amounts: {
      type: Number,
      default: 1
    },
    email: {
      type: String,
      required: false,
      trim: true
    },
    x: {
      type: String,
      required: false,
      trim: true
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WhitelistSubmission", WhitelistSubmissionSchema);