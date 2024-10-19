import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import JobModel from "../models/job.model.js";
import UserModel from "../models/user.model.js";
import { sendMail } from "../service/nodemailer.service.js";
import ErrorHandler from "../utils/errorHandler.utils.js";
import { sendEmailsSequentially } from "../utils/sendMail.utils.js";

// Post a new job
export const postJob = catchAsyncError(async (req, res, next) => {
    const { title, description, experienceLevel, candidates, endDate } = req.body;
    const user = await UserModel.findById(req.userId);

    if (!user) return next(new ErrorHandler('User not found', 404));

    // Validate input fields
    if (!title || !description || !experienceLevel || !endDate) {
        return next(new ErrorHandler('All fields are required!', 400));
    }

    // Validate date
    if (new Date(endDate) < new Date()) {
        return next(new ErrorHandler('End date cannot be in the past.', 400));
    }

    // Create and save the job
    const job = new JobModel({ 
        title, 
        description, 
        experienceLevel, 
        candidates, 
        endDate 
    });

    await job.save();

    // Send email notifications to candidates
    sendEmailsSequentially(candidates,job, user.companyName)

    res.status(201).json({ success: true, message: 'Job posted and notifications sent!' });
});

// Get all jobs
export const getJobs = catchAsyncError(async (req, res, next) => {
    const jobs = await JobModel.find();
    res.status(200).json({ success: true, jobs });
});

// Get job by ID
export const getJobById = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const job = await JobModel.findById(id);
    if (!job) return next(new ErrorHandler('Job not found', 404));

    res.status(200).json({ success: true, job });
});

// Delete a job by ID
export const deleteJob = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const job = await JobModel.findByIdAndDelete(id);
    if (!job) return next(new ErrorHandler('Job not found', 404));

    res.status(200).json({ success: true, message: 'Job deleted successfully!' });
});
