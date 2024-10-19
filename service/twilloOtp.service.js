import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config({path:'.env'})

const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN;  
const verifySid = process.env.TWILIO_VERIFY_SID;  
const client = twilio(accountSid, authToken);


async function createService() {
    const service = await client.verify.v2.services.create({
      friendlyName: "My First Verify Service",
    });
  
    console.log(service.sid);
  }
  
//   createService();

async function createVerification() {
    const verification = await client.verify.v2
      .services("VAcd2a8c406e76152d20a1bebb8030b36e")
      .verifications.create({
        channel: "sms",
        to: "+919907028851",
      });
  
    console.log(verification.status);
  }
  
//   createVerification();

async function createVerificationCheck() {
    const verificationCheck = await client.verify.v2
      .services("VAcd2a8c406e76152d20a1bebb8030b36e")
      .verificationChecks.create({
        code: "819765",
        to: "+919907028851",
      });
  
    console.log(verificationCheck.status);
  }
  
//   createVerificationCheck();


const sendSmsOTP = async(phoneNumber, otp)=>{
    try {
        const verification = await client.verify.v2
            .services(verifySid)
            .verifications.create({ to: phoneNumber, channel: 'sms' });
            console.log(verification)
        return true;
    } catch (error) {
        throw error
    }
}
// sendSmsOTP('+91907028851',202585);
export default sendSmsOTP