const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { Resend } = require("resend");
require("dotenv").config();

const app = express();

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const options = {
      from: "E3 Football Agency <onboarding@resend.dev>", // use a verified email or default resend.dev
      to: process.env.EMAIL_USER, // your email
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
`
    };

    // Send email
    await resend.emails.send(options);

    // Clean up uploaded file if any
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }

    res.send("🎉 Your registration was successful! We will contact you soon.");
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).send("❌ Error sending email");
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to E3 Football Agency!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
