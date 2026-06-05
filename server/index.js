import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = process.env.PORT || 5050;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, "..", "dist");

function parseOrigins(value) {
  if (!value) return [];

  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function buildAllowedOrigins() {
  const origins = new Set([
    "http://localhost:5173",
    "http://localhost:5174",
    ...parseOrigins(process.env.CLIENT_ORIGIN),
    ...parseOrigins(process.env.RENDER_EXTERNAL_URL),
    ...parseOrigins(process.env.VITE_APP_URL)
  ]);

  return origins;
}

const allowedOrigins = buildAllowedOrigins();

function getServerHost() {
  const candidates = [process.env.RENDER_EXTERNAL_URL, process.env.CLIENT_ORIGIN];

  for (const candidate of candidates) {
    if (!candidate) continue;

    try {
      return new URL(candidate).host;
    } catch {
      // Ignore invalid URL values.
    }
  }

  return null;
}

const serverHost = getServerHost();

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (allowedOrigins.has(origin)) return true;
  if (/^http:\/\/localhost:517\d$/.test(origin)) return true;
  if (/^https:\/\/[\w-]+\.onrender\.com$/.test(origin)) return true;

  if (serverHost) {
    try {
      return new URL(origin).host === serverHost;
    } catch {
      return false;
    }
  }

  return false;
}

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, origin || true);
        return;
      }

      console.warn("Blocked CORS origin:", origin);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);

app.use(express.json({ limit: "16kb" }));

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
    subject: { type: String, required: true, trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 1200 }
  },
  { timestamps: true }
);

const ContactMessage = mongoose.model("ContactMessage", contactSchema);

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: SMTP_SECURE === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
}

async function sendNotification(message) {
  const transporter = getTransporter();
  const to = process.env.CONTACT_TO_EMAIL;
  if (!transporter || !to) return;

  await transporter.sendMail({
    from: process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER,
    to,
    replyTo: message.email,
    subject: `Portfolio contact: ${message.subject}`,
    text: [
      `Name: ${message.name}`,
      `Email: ${message.email}`,
      `Subject: ${message.subject}`,
      "",
      message.message
    ].join("\n")
  });
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "portfolio-api",
    mongoConnected: mongoose.connection.readyState === 1
  });
});

app.post("/api/contact", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: "Contact form is temporarily unavailable. Please try again later."
    });
  }

  try {
    const { name = "", email = "", subject = "", message = "" } = req.body || {};
    const payload = {
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      subject: String(subject).trim(),
      message: String(message).trim()
    };

    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      return res.status(400).json({ error: "Please fill in every field." });
    }

    if (!isValidEmail(payload.email)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    const savedMessage = await ContactMessage.create(payload);
    await sendNotification(savedMessage).catch((error) => {
      console.error("Email notification failed:", error.message);
    });

    res.status(201).json({ ok: true, message: "Thanks, your message has been sent." });
  } catch (error) {
    console.error("Contact submission failed:", error);
    res.status(500).json({ error: "Something went wrong. Please try again soon." });
  }
});

app.use(express.static(distPath));

app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

async function connectMongo() {
  if (!process.env.MONGO_URI) {
    console.warn("MONGO_URI is not set. The contact form will be disabled.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
}

async function start() {
  await connectMongo();

  app.listen(port, "0.0.0.0", () => {
    console.log(`Portfolio server running on port ${port}`);
    if (process.env.RENDER_EXTERNAL_URL) {
      console.log(`Public URL: ${process.env.RENDER_EXTERNAL_URL}`);
    }
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
