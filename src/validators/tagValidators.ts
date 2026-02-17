import { ITag } from '../entity/tag.model';
import { ITagColor } from '../entity/tag-color.model';
import { ValidationError } from '../utils/errors';

export const validateTagCreate = (data: Partial<ITag>): void => {
    const { name, color, entityType, organisation } = data;

    // Custom Validation (Manual)
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        throw new ValidationError('Name is required and must be a string');
    }
    if (!color) {
        throw new ValidationError('Color ID is required');
    }
    // Basic ObjectId check
    if (!/^[0-9a-fA-F]{24}$/.test(color.toString())) {
        throw new ValidationError('Invalid Color ID format');
    }

    if (!entityType) throw new ValidationError('Entity Type is required');
    if (!['candidate', 'client', 'job'].includes(entityType)) {
        throw new ValidationError('Invalid Entity Type');
    }
};

export const validateTagUpdate = (data: Partial<ITag>): void => {
    if (data.name !== undefined && (typeof data.name !== 'string' || data.name.trim().length === 0)) {
        throw new ValidationError('Name cannot be empty');
    }
};

export const validateTagColorCreate = (data: Partial<ITagColor>): void => {
    // Custom Validation
    if (!data.color) throw new ValidationError('Color is required');

    // Validate Hex
    const hexRegex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
    if (!hexRegex.test(data.color)) throw new ValidationError('Invalid Hex Color format');

    if (!data.entityType) throw new ValidationError('Entity Type is required');
    if (!['candidate', 'client', 'job'].includes(data.entityType)) {
        throw new ValidationError('Invalid Entity Type');
    }
};
