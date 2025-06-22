require("dotenv").config(); // Load .env variables

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const nodemailer = require("nodemailer");
const multer = require("multer"); // ✅ Only declared once
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

// === Middleware ===
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded images

// === MySQL Setup ===
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
    process.exit(1);
  }
  console.log("✅ Connected to MySQL");
});

// === Multer Setup ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// === In-memory fallback storage ===
let items = [];

// === POST /items ===
app.post("/items", upload.array("images", 10), (req, res) => {
  try {
    const { name, type, description, coverImage } = req.body;

    const uploadedImages = req.files.map(
      (file) => `http://localhost:${PORT}/uploads/${file.filename}`
    );

    const newItem = {
      name,
      type,
      description,
      coverImage,
      images: uploadedImages,
    };

    items.push(newItem);
    res.status(201).json(newItem);
  } catch (err) {
    console.error("POST /items failed:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// === GET /items ===
app.get("/items", (req, res) => {
  res.json(items);
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post("/enquire", express.json(), async (req, res) => {
  const { itemName } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: `Enquiry about: ${itemName}`,
    text: `A user is interested in the item: ${itemName}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Enquiry email sent for: ${itemName}`);
    res.status(200).send("Enquiry email sent.");
  } catch (err) {
    console.error("❌ Email send failed:", err);
    res.status(500).send("Failed to send enquiry email.");
  }
});


// === Start Server ===
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
