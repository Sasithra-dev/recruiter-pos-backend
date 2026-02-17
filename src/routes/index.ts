import express from 'express';
import tagRoutes from './tagRoutes';

const router = express.Router();

router.use('/tags', tagRoutes);

export default router;
