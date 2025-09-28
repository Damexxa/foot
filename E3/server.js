const express = require("express");
const multer = require("multer");
const sgMail = require("@sendgrid/mail");
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
app.use(express.static(path.join(__dirname, "../frontend")));

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Handle registration form
app.post("/register", upload.single("image"), async (req, res) => {
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

  try {
    const msg = {
      to: process.env.EMAIL_USER, // Receiver email
      from: process.env.EMAIL_USER, // Must be verified on SendGrid
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
        ? [
            {
              content: fs.readFileSync(req.file.path).toString("base64"),
              filename: req.file.originalname,
              type: req.file.mimetype,
              disposition: "attachment"
            }
          ]
        : []
    };

    await sgMail.send(msg);

    // Delete uploaded file after sending
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.send("🎉 Your registration was successful! We will contact you soon.");
  } catch (error) {
    console.error("SendGrid error:", error);

    // Delete uploaded file even if email fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).send("❌ Error sending email");
  }
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

app.get("/", (req, res) => {
  res.send("Welcome to E3 Football Agency!");
});

// Dynamic port for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
