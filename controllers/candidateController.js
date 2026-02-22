const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const Candidate = require("../models/Candidate");

exports.uploadResume = async (req, res) => {
  try {
    const { candidateId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const candidate = await Candidate.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const uploadFromBuffer = () => {
      return new Promise((resolve, reject) => {

        const cldStream = cloudinary.uploader.upload_stream(
  {
    folder: "dmless/resumes",
    resource_type: "raw",
    public_id: req.file.originalname,
    overwrite: false,
    content_type: req.file.mimetype
  },
  (error, result) => {
    if (error) return reject(error);
    resolve(result);
  }
);

        streamifier.createReadStream(req.file.buffer).pipe(cldStream);
      });
    };

    const result = await uploadFromBuffer();

    candidate.resumeUrl = result.secure_url;
    await candidate.save();

    // ✅ IMPORTANT CHANGE: render success page instead of JSON
    return res.render("resumeSuccess", {
      candidate
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Resume upload failed" });
  }
};