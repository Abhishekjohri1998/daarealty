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

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;
const SERVER_VERSION = "1.0.1"; // Updated to verify server restart

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// --- Middleware & Headers ---
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("X-Daa-Server-Version", SERVER_VERSION);
  console.log(`[DAA-SERVER] ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// --- Models ---
import { AdminUser } from "./models/AdminUser";
import { Listing } from "./models/Listing";
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
    acl: "public-read",
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
