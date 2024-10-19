import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    experienceLevel: {
        type: String,
        enum: ['Fresher', 'Mid-Level', 'Senior-Level'],
        required: true,
    },
    candidates: {
        type: [String],  // Array of candidate emails
    },
    endDate: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const JobModel = mongoose.model('Job', jobSchema);

export default JobModel;
