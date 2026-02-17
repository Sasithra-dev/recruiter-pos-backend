import { Request, Response, NextFunction } from 'express';
import { TagService } from '../services/TagService';
import { TagColorService } from '../services/TagColorService';

const tagService = new TagService();
const tagColorService = new TagColorService();

export const createTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tenantId = req.tenantId;
        const userId = req.headers['x-user-id'] as string;

        if (!tenantId) return res.status(400).json({ success: false, message: 'Tenant Context Missing' });

        const data = {
            ...req.body,
            organisation: tenantId,
            auditInfo: {
                createdBy: userId,
                updatedBy: userId
            }
        };
        const tag = await tagService.create(data);
        res.status(201).json({ success: true, data: tag });
    } catch (error: any) {
        next(error);
    }
};

export const getTags = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tenantId = req.tenantId;
        // Helper to support global tags if needed, but primarily org-scoped
        const query = { ...req.query, organisation: tenantId };

        const result = await tagService.findAll(query);
        res.json({ success: true, ...result });
    } catch (error: any) {
        next(error);
    }
};

export const updateTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.headers['x-user-id'] as string;
        const patchOperations = req.body;

        const tag = await tagService.update(id as string, patchOperations, userId);
        res.json({ success: true, data: tag });
    } catch (error: any) {
        next(error);
    }
};

export const deleteTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const tenantId = req.tenantId;
        if (!tenantId) throw new Error('Tenant context missing');

        await tagService.delete(id as string, tenantId);
        res.json({ success: true, message: 'Tag archived' });
    } catch (error: any) {
        next(error);
    }
};

// --- Colors ---

export const getTagColors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tenantId = req.tenantId;
        const query = { ...req.query, organisation: tenantId };
        const result = await tagColorService.findAll(query);
        res.json({ success: true, ...result });
    } catch (error: any) {
        next(error);
    }
};

export const createTagColor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tenantId = req.tenantId;
        const userId = req.headers['x-user-id'] as string;

        const data = {
            ...req.body,
            organisation: tenantId,
            auditInfo: {
                createdBy: userId,
                updatedBy: userId
            }
        };

        const color = await tagColorService.create(data);
        res.status(201).json({ success: true, data: color });
    } catch (error: any) {
        next(error);
    }
};

export const deleteTagColor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const tenantId = req.tenantId;
        if (!tenantId) throw new Error('Tenant context missing');

        await tagColorService.delete(id as string, tenantId);
        res.json({ success: true, message: 'Color preset deleted successfully' });
    } catch (error: any) {
        next(error);
    }
};
