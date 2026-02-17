import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// Extend Express Request interface to include tenantId
declare global {
    namespace Express {
        interface Request {
            tenantId?: string;
        }
    }
}

export const tenantMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const tenantId = req.headers['x-tenant-id'] as string;

    if (!tenantId) {
        logger.warn('Missing x-tenant-id header');
        res.status(400).json({
            success: false,
            error: {
                code: 'MISSING_TENANT_ID',
                message: 'x-tenant-id header is required'
            }
        });
        return;
    }

    // Attach tenantId to request object for downstream use
    req.tenantId = tenantId;

    // Log the tenant context
    logger.info(`Request for tenant: ${tenantId}`);

    next();
};
