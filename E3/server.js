const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
require("dotenv").config(); 

const app = express();
const upload = multer({ dest: "uploads/" });

// Parse URL-encoded bodies
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
    if (req.file) fs.unlinkSync(req.file.path); // delete temp file
    if (error) {
      console.error(error);
      return res.status(500).send("❌ Error sending email");
    }
    res.send("✅ Registration submitted and sent to your email!");
  });
});

// Dynamic port for Render
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
