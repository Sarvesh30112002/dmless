const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true
    },

    fullName: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true
    },

    hiringLinkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HiringLink"
  },

    selectedAnswers: {
      type: [Number],
      required: true
    },

    isKnockedOut: {
      type: Boolean,
      default: false
    },

    resumeUrl: {
      type: String
    },

    status: {
      type: String,
      enum: ["knocked", "shortlisted"],
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Candidate", candidateSchema);