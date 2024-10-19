import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({path:'.env'});



const sendOTP = async (phoneNumber, otp) => {
    const apiKey = process.env.FAST2SMS_API_KEY; // Replace with your Fast2SMS API key
    const message = `Your OTP is: ${otp}`;

    const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&message=${encodeURIComponent(message)}&numbers=${phoneNumber}&sender_id=FSTSMS&route=qt`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw error;
    }
};

export default sendOTP