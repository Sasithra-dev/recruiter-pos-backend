import app from './app';
import { connectDB } from './config/db';
import { logger } from './utils/logger';
import dotenv from 'dotenv';
import http from 'http';


dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    const httpServer = http.createServer(app);

    httpServer.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
    });
};

startServer();
