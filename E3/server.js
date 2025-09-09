const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config(); 

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(bodyParser.urlencoded({ extended: true }));



// 👉 Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Nodemailer config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // from .env
    pass: process.env.EMAIL_PASS  // from .env
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
    from: process.env.EMAIL_USER, // use env email
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

app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);
