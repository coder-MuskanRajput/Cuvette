import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
   const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: '24h' });
   const options = {
       expires: new Date(Date.now() + process.env.COOKIES_EXPIRE * 20 * 60 * 60 * 1000),
       httpOnly: true,
   };
   return { token, options };
};

export const verifyToken = (token) => {
   try {
       return jwt.verify(token, process.env.JWT_SECRET);
   } catch (error) {
       return null;
   }
};
