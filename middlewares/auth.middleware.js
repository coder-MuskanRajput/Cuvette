import { verifyToken } from '../utils/sendToken.utils.js';
import { catchAsyncError } from './catchAsyncError.js';

const authenticateToken = () => catchAsyncError(async(req, res, next)=>{
    let authHeader = req.headers['authorization'];
    console.log(authHeader,'---------------')
    let token = authHeader && authHeader.split(' ')[1];

    if (!authHeader) {
      authHeader = req.cookies;
    }

    if (token == null) {
      token = req.cookies?.token;
    }

    if (token == null) return res.sendStatus(401);
   const isVerified =  verifyToken(token)
   if(!isVerified) return res.sendStatus(403);
   req.userId = isVerified?.userId
   next();

    
});

export default authenticateToken;


