import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import UserModel from "../models/user.model.js";
import sendOTP from "../service/fast2sms.service.js";
import { sendMail } from "../service/nodemailer.service.js";
import ErrorHandler from "../utils/errorHandler.utils.js";
import { generateToken } from "../utils/sendToken.utils.js";

export const userRegister = catchAsyncError(async (req, res, next) => {
    const { companyEmail, name, companyName, mobileNumber, employeeSize } = req.body;

    // Check for required fields
    if (!companyEmail || !name || !companyName || !mobileNumber || !employeeSize) {
        return next(new ErrorHandler('All fields are required!', 400));
    }

    // Check if user already exists
    let user = await UserModel.findOne({ companyEmail });
    if (user) return next(new ErrorHandler('User already exists', 409));

    // Generate and send email OTP
    const emailOtp = Math.floor(1000 + Math.random() * 9000);
    const expirationDateEmail = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiration
    const context = { otp: emailOtp };
    
    const isMailSend = await sendMail('register_otp', context, "",'Cuvette', companyEmail);
    // if (!isMailSend) return next(new ErrorHandler('Unable to send Mail OTP', 409));

    // Generate and send SMS OTP
    const smsOTP = Math.floor(100000 + Math.random() * 900000).toString();
    // const isSMSSend = await sendOTP(mobileNumber, smsOTP);
    // if (!isSMSSend) return next(new ErrorHandler('Unable to send SMS OTP', 409));

    // Create and save the user
    user = new UserModel({
        companyEmail, name, companyName, mobileNumber, employeeSize,
        otpEmail: { OTP: emailOtp, expirationDate: expirationDateEmail },
        otpMobile: { OTP: smsOTP, expirationDate: expirationDateEmail }
    });
    
    await user.save();
    res.status(201).json({ success: true, message: 'OTP sent successfully',mobileOtp : smsOTP});
});

// Email OTP verification
export const emailVerifyOTP = catchAsyncError(async (req, res, next) => {
    const { email, emailOTP } = req.body;
    console.log(req.body)
    
    // Check for required fields
    if (!email || !emailOTP || emailOTP.length < 4) {
        return next(new ErrorHandler('Invalid OTP details', 400));
    }

    const user = await UserModel.findOne({ companyEmail: email });
    if (!user) return next(new ErrorHandler('Email address not found', 404));

    const { OTP, expirationDate } = user.otpEmail;
    
    // Check for OTP expiration
    if (Date.now() > expirationDate) {
        return next(new ErrorHandler('OTP expired', 400));
    }

    // Check for OTP match
    if (OTP != emailOTP) {
        return next(new ErrorHandler('Invalid OTP', 400));
    }
    if (!user.isEmailVerified && user.isMobileVerified ) {
        const context = {
            name:user.name
        }
        // await sendMail('welcome_email',context, "",'Cuvette', user.companyEmail,"")
    }

    // Mark email as verified
    if (!user.isEmailVerified) {
        user.isEmailVerified = true;

    }
    let token = false
    if (user.isEmailVerified && user.isMobileVerified ) {
        token = generateToken(user._id);
    }
    user.otpEmail = { OTP: -1 };
    await user.save();

    res.status(200).json({ success: true, message: 'Email Verified!' , token});
});

// SMS OTP verification
export const smsVerifyOTP = catchAsyncError(async (req, res, next) => {
    const { email, smsOTP } = req.body;
    console.log(email, smsOTP)

    // Check for required fields
    if (!email || !smsOTP || smsOTP.length < 6) {
        return next(new ErrorHandler('Invalid OTP details', 400));
    }

    const user = await UserModel.findOne({ companyEmail: email });
    if (!user) return next(new ErrorHandler('Email address not found', 404));

    const { OTP, expirationDate } = user.otpMobile;

    // Check for OTP expiration
    if (Date.now() > expirationDate) {
        return next(new ErrorHandler('OTP expired', 400));
    }

    // Check for OTP match
    if (OTP != smsOTP) {
        return next(new ErrorHandler('Invalid OTP', 400));
    }

    if (user.isEmailVerified && !user.isMobileVerified ) {
        const context = {
            name:user.name
        }
        // await sendMail('welcome_email',context, 'Cuvette', user.companyEmail)
    }

    // Mark mobile as verified
    if (!user.isMobileVerified) {
        user.isMobileVerified = true;
    }
    let token = false
    if (user.isEmailVerified && user.isMobileVerified ) {
        token = generateToken(user._id);
    }
    user.otpMobile = { OTP: -1 };
    await user.save();

    res.status(200).json({ success: true, message: 'Mobile Number Verified!', token });
});

// User login
export const userLogin = catchAsyncError(async (req, res, next) => {
    const { companyEmail } = req.body;

    // Check for required fields
    if (!companyEmail) return next(new ErrorHandler('Invalid Email', 400));

    const user = await UserModel.findOne({ companyEmail });
    if (!user) return next(new ErrorHandler('User not found', 404));

    // Generate and send email OTP
    const emailOtp = Math.floor(1000 + Math.random() * 9000);
    const expirationDateEmail = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiration
    const context = { otp: emailOtp };
    
    const isMailSend = await sendMail('verifyAccountEmail', context, 'Cuvette', companyEmail);
    if (!isMailSend) return next(new ErrorHandler('Unable to send Mail OTP', 409));

    // Update the user's OTP details
    user.otpEmail = { OTP: emailOtp, expirationDate: expirationDateEmail };
    await user.save();

    res.status(200).json({ success: true, message: 'OTP sent successfully' });
});

export const userLoginOtpVerify = catchAsyncError(async(req, res, next)=>{
    const {otp, companyEmail} = req.body;
    // Check for required fields
    if (!companyEmail) return next(new ErrorHandler('Invalid Email', 400));

    const user = await UserModel.findOne({ companyEmail });
    if (!user) return next(new ErrorHandler('User not found', 404));

    const { OTP, expirationDate } = user.otpEmail;
    
    // Check for OTP expiration
    if (Date.now() > expirationDate) {
        return next(new ErrorHandler('OTP expired', 400));
    }

    // Check for OTP match
    if (OTP !== emailOTP) {
        return next(new ErrorHandler('Invalid OTP', 400));
    }

    const token = generateToken(user._id);
    
    res.status(201).json({success:true, token:token, user:user});
});

export const getUserDetails = catchAsyncError(async(req, res, next)=>{
    const id = req.userId
    const user = await UserModel.findById(id);
    if (!user) return next(new ErrorHandler('User not found', 404));
    res.status(201).json({success:true, user:user});
});
