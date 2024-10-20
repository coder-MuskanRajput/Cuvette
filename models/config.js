import mongoose from 'mongoose';

export const connectMongoose = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Database Connected');
    } catch (error) {
        console.log(error.message);
    }
};
