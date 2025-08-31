const express = require("express");
const router = express.Router();
const { requestOtp, verifyOtp, refreshToken } = require("../controllers/authController");

router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);
router.post("/refresh-token", refreshToken);

module.exports = router;