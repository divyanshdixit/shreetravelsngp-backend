require('dotenv').config();
const authToken = process.env.TWILIO_AUTH_TOKEN;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const client = require('twilio')(accountSid, authToken);

class OtpController{
    // generate otp:
    static otpGenerator = () => {
        // creating 4 digit otp;
        return Math.floor(1000 + Math.random()*9000);
    }

    static sendOtp = async(req, res) => {
        try{
            const contact = req.body.contact;
            const otp = this.otpGenerator();
            const result = await client.verify.v2.services(process.env.TWILIO_SERVICE_ID)
            .verifications.create({
                to: `+91${contact}`,
                channel: 'sms'
            })
            res.status(200).json({success: true, message: "Otp sent successfully!", id: result.sid, status: result.status})
        }catch(err){
            res.status(400).json({success: false, message:err.message})
        }
    }

    static verifyOtp = async(req, res) => {
        try{
            const {contact, code} = req.body;
            const result = await client.verify.v2.services(process.env.TWILIO_SERVICE_ID)
            .verificationChecks.create({
                to: `+91${contact}`,
                code
            })
            res.status(200).json({success: true, message: "Otp verified successfully!", status: result.status})
        }catch(err){
            res.status(400).json({success: false, message: err.message})
        }
    }
}
// send otp to user:

module.exports = OtpController;
