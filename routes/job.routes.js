import express from 'express';
import { postJob, getJobs, getJobById, deleteJob } from '../controller/job.controller.js';
import authenticateToken from '../middlewares/auth.middleware.js';

const router = express.Router();

// Job routes
router.post('/jobs',authenticateToken(), postJob);  // Create job and send notifications
router.get('/jobs',authenticateToken(), getJobs);  // Get all jobs
router.get('/jobs/:id',authenticateToken(), getJobById);  // Get job by ID
router.delete('/jobs/:id',authenticateToken(), deleteJob);  // Delete job by ID

export default router;
