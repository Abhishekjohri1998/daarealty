import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createServer as createViteServer } from "vite";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import cors from "cors";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;
const SERVER_VERSION = "1.0.3"; // Updated with CORS and Content route fixes

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// --- Middleware & Headers ---
app.use(cors()); // Enable CORS for cross-subdomain access
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("X-Daa-Server-Version", SERVER_VERSION);
  console.log(`[DAA-SERVER] ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

//import path from "path";
import nodemailer from "nodemailer";
// --- Models ---
import { AdminUser } from "./models/AdminUser";
import { Listing } from "./models/Listing";
import { Content } from "./models/Content";
import { Inquiry } from "./models/Inquiry";
import { Newsletter } from "./models/Newsletter";
import TeamMember from "./models/TeamMember";
// --- Models ---

// --- Auth Middleware ---
const authenticateAdmin = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "daa_realty_secret_123_change_me");
    req.admin = verified;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// --- API Routes (Prefix with /api) ---

// --- Email Configuration ---
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Contact & Inquiries
app.post("/api/contact", async (req, res) => {
  try {
    const inquiry = new Inquiry(req.body);
    await inquiry.save();
    
    // 1. Send confirmation to user
    const userMailOptions = {
      from: `"DAA Realty" <${process.env.EMAIL_USER}>`,
      to: inquiry.email,
      subject: "Thank you for your inquiry - DAA Realty",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #E65E19;">Hello ${inquiry.firstName},</h2>
          <p>Thank you for reaching out to **DAA Realty**. We have received your inquiry regarding <strong>${inquiry.interest}</strong>.</p>
          <p>Our team will review your message and get back to you shortly.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">This is an automated response. Please do not reply directly to this email.</p>
        </div>
      `,
    };

    // 2. Send notification to admin
    const adminMailOptions = {
      from: `"DAA Web System" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Inquiry: ${inquiry.firstName} ${inquiry.lastName} - ${inquiry.interest}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>New Inquiry Received</h2>
          <p><strong>Name:</strong> ${inquiry.firstName} ${inquiry.lastName}</p>
          <p><strong>Email:</strong> ${inquiry.email}</p>
          <p><strong>Phone:</strong> ${inquiry.phone}</p>
          <p><strong>Interest:</strong> ${inquiry.interest}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="background: #f9f9f9; padding: 15px; border-left: 5px solid #E65E19;">${inquiry.message}</blockquote>
          <p><a href="https://admin.daarealty.in/admin/dashboard" style="background: #E65E19; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Admin Panel</a></p>
        </div>
      `,
    };

    transporter.sendMail(userMailOptions).catch(err => console.error("Error sending user email:", err));
    transporter.sendMail(adminMailOptions).catch(err => console.error("Error sending admin notification:", err));
    
    res.json({ message: "Inquiry received successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to process inquiry" });
  }
});

app.get("/api/admin/inquiries", authenticateAdmin, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch inquiries" });
  }
});

// Newsletter
app.post("/api/newsletter", async (req, res) => {
  try {
    const newsletter = new Newsletter(req.body);
    await newsletter.save();
    
    const welcomeMailOptions = {
      from: `"DAA Realty" <${process.env.EMAIL_USER}>`,
      to: newsletter.email,
      subject: "Welcome to DAA Realty Updates",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px; text-align: center;">
          <h2 style="color: #E65E19;">You're on the list!</h2>
          <p>Thank you for signing up for updates from **DAA Realty**.</p>
          <p>We'll keep you informed about our latest luxury developments, investment opportunities, and market insights.</p>
          <div style="margin-top: 30px;">
            <a href="https://daarealty.in" style="background: #E65E19; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Visit our Website</a>
          </div>
        </div>
      `,
    };

    transporter.sendMail(welcomeMailOptions).catch(err => console.error("Error sending newsletter email:", err));
    
    res.json({ message: "Signed up successfully" });
  } catch (err) {
    if ((err as any).code === 11000) {
      return res.status(400).json({ error: "Email already subscribed" });
    }
    res.status(500).json({ error: "Failed to sign up" });
  }
});

app.get("/api/admin/newsletters", authenticateAdmin, async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ signedUpAt: -1 });
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch subscribers" });
  }
});

// Ping for connectivity check
app.get("/api/ping", (req, res) => {
  console.log("[DAA-API] GET /api/ping - Responding with OK");
  res.json({ 
    status: "ok", 
    version: SERVER_VERSION,
    timestamp: new Date().toISOString()
  });
});

// Auth
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await AdminUser.findOne({ username });
    if (!admin) return res.status(401).json({ error: "Invalid credentials" });

    const validPass = await bcrypt.compare(password, admin.password);
    if (!validPass) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || "daa_realty_secret_123_change_me");
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- Storage Configuration (S3 or Local) ---
const s3 = process.env.AWS_ACCESS_KEY_ID ? new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
}) : null;

const localStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage: s3 ? multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET || "daa-realty-assets",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `uploads/${Date.now()}-${file.originalname}`);
    },
  }) : localStorage,
});

app.post("/api/upload", authenticateAdmin, (req: any, res: any) => {
  console.log("[DAA-API] POST /api/upload - Starting image upload" + (s3 ? " (S3)" : " (Local)"));
  upload.array("images", 10)(req, res, (err: any) => {
    if (err) {
      console.error("[DAA-API] Upload Error:", err);
      return res.status(500).json({ error: err.message });
    }
    const files = req.files as any[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    // multer-s3 provides 'location', diskStorage provides 'filename'
    const urls = files.map(file => file.location || `/uploads/${file.filename}`);
    console.log(`[DAA-API] Upload Success: ${urls.length} files`);
    res.json({ urls });
  });
});

// Content
app.get("/api/content", async (req, res) => {
  try {
    const content = await Content.find();
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch content" });
  }
});

app.put("/api/content/:key", authenticateAdmin, async (req, res) => {
  try {
    const updated = await Content.findOneAndUpdate(
      { key: req.params.key },
      { value: req.body.value },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update content" });
  }
});

// Listings
app.get("/api/listings", async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

app.post("/api/listings", authenticateAdmin, async (req, res) => {
  try {
    const listing = new Listing(req.body);
    await listing.save();
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: "Failed to create listing" });
  }
});

app.put("/api/listings/:id", authenticateAdmin, async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: "Failed to update listing" });
  }
});

app.delete("/api/listings/:id", authenticateAdmin, async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete listing" });
  }
});

// Team Members
app.get("/api/team", async (req, res) => {
  try {
    const team = await TeamMember.find().sort({ order: 1, createdAt: 1 });
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch team" });
  }
});

app.post("/api/team", authenticateAdmin, async (req, res) => {
  try {
    const member = new TeamMember(req.body);
    await member.save();
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: "Failed to create team member" });
  }
});

app.put("/api/team/:id", authenticateAdmin, async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: "Failed to update team member" });
  }
});

app.delete("/api/team/:id", authenticateAdmin, async (req, res) => {
  try {
    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete team member" });
  }
});

// Static files for uploads MUST be defined before Vite fallback
app.use("/uploads", express.static(UPLOADS_DIR));

// --- Vite Integration & SPA Fallback ---
async function startServer() {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/daa-realty");
  console.log("[DAA-SERVER] Connected to MongoDB");

  if (process.env.NODE_ENV !== "production") {
    console.log("[DAA-SERVER] Starting Vite in dev mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`[DAA-SERVER] v${SERVER_VERSION} running at http://localhost:${PORT}`);
    console.log(`[DAA-SERVER] Diagnostic: If you don't see [DAA-SERVER] logs here, you are running the wrong code!`);
  });
}

// Global Error Handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error("[DAA-SERVER] Global Error:", err);
  if (req.path.startsWith("/api/")) {
    return res.status(500).json({ error: "API Internal Server Error", details: err.message });
  }
  next(err);
});

// API Path Fallback (404 for nonexistent API routes)
app.all("/api/*", (req, res) => {
  res.status(404).json({ error: `API route ${req.method} ${req.url} not found` });
});

startServer().catch(err => {
  console.error("[DAA-SERVER] Failed to start:", err);
});
