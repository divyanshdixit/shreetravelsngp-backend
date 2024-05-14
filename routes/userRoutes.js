const express = require('express');
const OtpController = require('../controllers/otpController.js');
const router = express.Router();

router.post('/generateotp', OtpController.sendOtp);
router.post('/verifyotp', OtpController.verifyOtp)

module.exports = router;