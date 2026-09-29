const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

// Contact Schema
const contactSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    brandName: {
      type: String,
      required: true,
      trim: true,
    },
    websiteOrSocialLink: {
      type: String,
      required: true,
      trim: true,
    },
    requirements: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

const Contact = mongoose.model("Contact", contactSchema);

// ===============================
// POST - Submit Contact Form
// ===============================
app.post("/api/contact", async (req, res) => {
  try {
    const { fullName, email, brandName, websiteOrSocialLink, requirements } =
      req.body;

    // Check required fields
    if (
      !fullName ||
      !email ||
      !brandName ||
      !websiteOrSocialLink ||
      !requirements
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Create contact
    const contact = await Contact.create({
      fullName,
      email,
      brandName,
      websiteOrSocialLink,
      requirements,
    });

    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully",
      data: contact,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
});

// ===============================
// GET - Get All Contacts
// ===============================
app.get("/api/contact", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch contacts",
      error: error.message,
    });
  }
});

// Test API
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Contact API is running",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
