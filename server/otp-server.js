const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const nodemailer = require("nodemailer");

dotenv.config();

const app = express();
const port = process.env.OTP_PORT || 4000;
const emailUser = process.env.OTP_EMAIL_USER;
const emailAppPassword = process.env.OTP_EMAIL_APP_PASSWORD;
const allowedOrigin = process.env.OTP_ALLOWED_ORIGIN || "http://localhost:3000";
const otpStore = new Map();

app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function createOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function getTransporter() {
  if (!emailAppPassword) {
    throw new Error("Missing OTP_EMAIL_APP_PASSWORD in .env");
  }

  if (!emailUser) {
    throw new Error("Missing OTP_EMAIL_USER in .env");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailAppPassword,
    },
  });
}

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "bookstack-otp" });
});

app.post("/api/send-otp", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);

    if (!email) {
      return res.status(400).json({ status: "error", error: "Email is required" });
    }

    const otp = createOtp();
    const expiresAt = Date.now() + 5 * 60 * 1000;
    otpStore.set(email, { otp, expiresAt });

    await getTransporter().sendMail({
      from: `"BookStack" <${emailUser}>`,
      to: email,
      subject: "Your BookStack OTP",
      text: `Your BookStack verification OTP is ${otp}. It expires in 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>BookStack Verification</h2>
          <p>Your OTP is:</p>
          <p style="font-size: 28px; font-weight: 700; letter-spacing: 4px;">${otp}</p>
          <p>This code expires in 5 minutes.</p>
        </div>
      `,
    });

    return res.json({ status: "ok" });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      error: error.message || "Unable to send OTP",
    });
  }
});

app.post("/api/verify-otp", (req, res) => {
  const email = normalizeEmail(req.body.email);
  const otp = String(req.body.otp || "").trim();
  const savedOtp = otpStore.get(email);

  if (!email || !otp) {
    return res.status(400).json({ status: "error", error: "Email and OTP are required" });
  }

  if (!savedOtp) {
    return res.status(400).json({ status: "error", error: "OTP not found. Please request a new OTP." });
  }

  if (Date.now() > savedOtp.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ status: "error", error: "OTP expired. Please request a new OTP." });
  }

  if (savedOtp.otp !== otp) {
    return res.status(400).json({ status: "error", error: "Invalid OTP" });
  }

  otpStore.delete(email);
  return res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`BookStack OTP server running on http://localhost:${port}`);
});
