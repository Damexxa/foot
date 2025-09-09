const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
require("dotenv").config(); 

const app = express();

// Limit file size to 5MB
const upload = multer({ 
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Parse URL-encoded and JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "frontend")));

// Nodemailer config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Handle registration form
app.post("/register", upload.single("image"), (req, res) => {
  const {
    surname,
    firstname,
    middlename,
    address,
    state,
    lga,
    religion,
    phone,
    dob,
    sex,
    guardian_name,
    guardian_address,
    guardian_phone
  } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "📌 New E3 Football Agency Registration",
    text: `
New Registration Received:

Player Info:
- Surname: ${surname}
- First Name: ${firstname}
- Middle Name: ${middlename}
- Address: ${address}
- State: ${state}
- LGA: ${lga}
- Religion: ${religion}
- Phone: ${phone}
- Date of Birth: ${dob}
- Sex: ${sex}

Guardian Info:
- Name: ${guardian_name}
- Address: ${guardian_address}
- Phone: ${guardian_phone}
`,
    attachments: req.file
      ? [{ filename: req.file.originalname, path: req.file.path }]
      : []
  };

  transporter.sendMail(mailOptions, (error, info) => {
    // Delete uploaded file immediately to free memory
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }

    if (error) {
      console.error("Email error:", error);
      return res.status(500).send("❌ Error sending email");
    }

    res.send("✅ Registration submitted and sent to your email!");
  });
});

// Handle file size or other multer errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).send("❌ File too large. Max size is 5MB.");
    }
    return res.status(400).send(`❌ Multer error: ${err.message}`);
  }
  next(err);
});

// Dynamic port for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server runnin
