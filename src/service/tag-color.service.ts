import { TagColorRepository } from '../repository/tag-color.repository';
import { ITagColor } from '../entity/tag-color.model';
import mongoose from 'mongoose';

import { validateTagColorCreate } from '../validators/tag.validators';

export class TagColorService {
    private repository: TagColorRepository;

    constructor() {
        this.repository = new TagColorRepository();
    }

    async create(data: Partial<ITagColor>): Promise<ITagColor> {
        validateTagColorCreate(data);
        return await this.repository.create(data);
    }

    async findAll(query: any): Promise<{ data: ITagColor[], total: number }> {
        const { organisation, entityType } = query;
        const filter: any = {};

        // Colors can be global (organisation: null) or org-specific
        if (organisation) {
            filter.$or = [
                { organisation: null },
                { organisation: organisation }
            ];
        } else {
            filter.organisation = null;
        }

        filter.active = true;

        if (entityType) filter.entityType = entityType;

        const result = await this.repository.findAll(filter, 1, 100);
        return { data: result.data, total: result.pagination.total };
    }

    async findById(id: string): Promise<ITagColor | null> {
        return await this.repository.findById(id);
    }

    async delete(id: string, tenantId: string): Promise<ITagColor | null> {
        const color = await this.repository.findById(id);
        if (!color) throw new Error('Color preset not found');

        // Verify Ownership
        if (!color.organisation) {
            throw new Error('Cannot delete global color presets');
        }

        if (color.organisation.toString() !== tenantId) {
            throw new Error('You do not have permission to delete this color preset');
        }

        return await this.repository.softDelete(id);
    }
}
