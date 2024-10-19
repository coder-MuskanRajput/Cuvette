import dotenv from 'dotenv';
dotenv.config({path:'./.env'});
import express from 'express';
import helmet from 'helmet';
import logger from 'morgan';
import cors from 'cors';
import session from 'express-session';
import cookiesParser from 'cookie-parser';
import { connectMongoose } from './models/config.js'



const app = express();

// Helmet to set security headers
app.use(helmet());

// Additional Helmet settings 
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdnjs.cloudflare.com"], 
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
    },
}));

connectMongoose();

// Logger 
app.use(logger('tiny'));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS
app.use(cors());

// Session and cookies
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.EXPRESS_SESSION_SECRET
}));
app.use(cookiesParser());

const PORT = process.env.PORT || 3000;

import userRoutes from './routes/user.routes.js'
import templateRoutes from './routes/templates.routes.js'
import job from './routes/job.routes.js'

import ErrorHandler from './utils/errorHandler.utils.js';
import { generateError } from './middlewares/error.middleware.js';


app.use('/auth', userRoutes);
app.use('/templates', templateRoutes);
app.use('/job', job);
// app.use('/notification',notificationRoutes)

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Error handling
app.all('*', (req, res, next) => {
    next(new ErrorHandler(`Requested URL not found ${req.url}`, 404));
});

app.use(generateError);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} `);
});
