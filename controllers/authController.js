const jwt = require("jsonwebtoken");
const db = require("../config/db");

const ACCESS_SECRET = "access_secret";
const REFRESH_SECRET = "refresh_secret";

// Generate OTP
exports.requestOtp = (req, res) => {
  const { email, mobile } = req.body;
  if (!email && !mobile) return res.status(400).json({ error: "Email or mobile required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = Date.now() + 5 * 60 * 1000;

  // Insert a new user OR update an existing one with OTP details
db.run(
  `
  INSERT OR REPLACE INTO users 
  (email, mobile, otp, otp_expiry) 
  VALUES (?, ?, ?, ?)
  `,
  // The values that will replace the ? placeholders
  [email, mobile, otp, otpExpiry],

  // Callback function to check result
  function (err) {
    if (err) {
      // If something goes wrong, send error response
      return res.status(500).json({ error: err.message });
    }

    // If everything is okay → log the OTP in console
    console.log(`OTP for ${email || mobile}: ${otp}`);

    // Send response back to client
    res.json({ message: "OTP generated. Check console for details." });
  }
);
};

// Verify OTP & issue tokens
exports.verifyOtp = (req, res) => {
  // Get email, mobile, and OTP from user request
  const { email, mobile, otp } = req.body;

  // Search in database: user must match either email OR mobile AND OTP
  db.get(
    `SELECT * FROM users WHERE (email=? OR mobile=?) AND otp=?`,
    [email, mobile, otp], // values to replace ? in query
    (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) return res.status(400).json({error:"User not found (invalid email or mobile)"})
      if (user.otp != otp) return res.status(400).json({ error: "Invalid OTP" });
      if (Date.now() > user.otp_expiry) return res.status(400).json({ error: "OTP expired" });

      const accessToken = jwt.sign({ id: user.id }, ACCESS_SECRET, { expiresIn: "15m" });
      const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: "7d" });

      res.json({ accessToken, refreshToken });
    }
  );
};

// Refresh token
exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: "Refresh token required" });

  jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid refresh token" });
    const newAccessToken = jwt.sign({ id: user.id }, ACCESS_SECRET, { expiresIn: "15m" });
    res.json({ accessToken: newAccessToken });
  });
};