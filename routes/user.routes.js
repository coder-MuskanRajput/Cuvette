import express from 'express';
import {
    userRegister,
    emailVerifyOTP,
    smsVerifyOTP,
    userLogin,
    getUserDetails
} from '../controller/user.controller.js';
import authenticateToken from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', userRegister);
router.post('/verify-email', emailVerifyOTP);
router.post('/verify-sms', smsVerifyOTP);
router.post('/login', userLogin);
router.get('/user', authenticateToken(), getUserDetails);

export default router;
