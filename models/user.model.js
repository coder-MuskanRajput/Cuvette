import mongoose from 'mongoose';
import validator from 'validator';

// OTP Schema
const otpSchema = new mongoose.Schema({
    OTP: {
        type: Number,
        default: -1,
    },
    expirationDate: {
        type: Date,
        default: null
    }
}, { _id: false });

// User Schema
const userModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    companyName:{
        type:String,
        unique:true,
        required: true,
    },
    companyEmail: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: 'Invalid email format'
        }
    },
    mobileNumber:{
        type:Number,
        unique: true,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        // required: true,
        select: false,
        minlength: [6, 'Password must be at least 6 characters long']
    },
    otpEmail: {
        type: otpSchema,
        default: () => ({})
    },
    
    otpMobile: {
        type: otpSchema,
        default: () => ({})
    },
    
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isMobileVerified: {
        type: Boolean,
        default: false
    },
    employeeSize:{
        type:Number,
        require:true
    }
}, { timestamps: true });

const UserModel = mongoose.model('user_model', userModel);
export default UserModel;
