import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/recruiter-service';

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGO_URI);
        logger.info('MongoDB Connected Successfully');
    } catch (error) {
        logger.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
};
