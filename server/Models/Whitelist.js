const mongoose = require("mongoose");

const WhitelistSubmissionSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WhitelistSubmission", WhitelistSubmissionSchema);