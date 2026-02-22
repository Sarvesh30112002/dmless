const mongoose = require("mongoose");

const mcqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true
    },

    options: {
      type: [String],
      required: true
    },

    correctAnswerIndex: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const jobSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruiter",
      required: true
    },

    jobRole: {
      type: String,
      required: true
    },

    jobDescription: {
      type: String,
      required: true
    },

    mcqs: {
  type: [
    {
      question: { type: String, required: true },
      options: { type: [String], required: true },
      correctAnswerIndex: { type: Number, required: true }
    }
  ],
  validate: {
    validator: function (v) {
      // allow 1 to 5 MCQs
      return v.length >= 1 && v.length <= 5;
    },
    message: "MCQs must be between 1 and 5"
  }
},

    publicId: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

function arrayLimit(val) {
  return val.length === 5;
}

module.exports = mongoose.model("Job", jobSchema);