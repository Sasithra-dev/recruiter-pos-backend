import { TagRepository } from '../repository/tag.repository';
import { ITag } from '../entity/tag.model';
import { TagColorRepository } from '../repository/tag-color.repository';
import { applyPatch } from 'fast-json-patch';
import { validateTagCreate, validateTagUpdate } from '../validators/tagValidators';

export class TagService {
    private repository: TagRepository;
    private colorRepository: TagColorRepository;

    constructor() {
        this.repository = new TagRepository();
        this.colorRepository = new TagColorRepository();
    }

    async create(data: Partial<ITag>): Promise<ITag> {
        validateTagCreate(data);

        // Ensure Color Exists
        const colorExists = await this.colorRepository.findById(data.color!.toString());
        if (!colorExists) throw new Error('Invalid Color ID');

        return await this.repository.create(data);
    }

    async findAll(query: any): Promise<{ data: ITag[], total: number }> {
        const { organisation, entityType, search, archived, page = 1, limit = 20 } = query;
        const filter: any = {};

        if (organisation) {
            filter.$or = [
                { organisation: null },
                { organisation: organisation }
            ];
        } else {
            filter.organisation = null;
        }
        if (entityType) filter.entityType = entityType;
        if (search) filter.name = { $regex: search, $options: 'i' };

        // Soft Delete Filter
        if (archived === 'true') {
            filter.active = false;
        } else {
            filter.active = true;
        }

        const result = await this.repository.findAll(filter, Number(page), Number(limit), { createdAt: -1 }, 'color');

        return { data: result.data, total: result.pagination.total };
    }

    async findById(id: string): Promise<ITag | null> {
        return await this.repository.findById(id, undefined, { populate: 'color' });
    }

    async update(id: string, patchOperations: any[], userId?: string): Promise<ITag | null> {
        const tag = await this.repository.findById(id);
        if (!tag) throw new Error('Tag not found');

        // Apply Patch
        const { newDocument } = applyPatch(tag.toObject(), patchOperations);

        // Update Audit Info
        if (userId) {
            if (!newDocument.auditInfo) newDocument.auditInfo = {};
            newDocument.auditInfo.updatedBy = userId;
            newDocument.auditInfo.updatedAt = new Date();
        }

        // Validate Updates
        validateTagUpdate(newDocument);

        if (newDocument.color) {
            const colorExists = await this.colorRepository.findById(newDocument.color.toString());
            if (!colorExists) throw new Error('Invalid Color ID');
        }

        return await this.repository.update(id, newDocument);
    }

    async delete(id: string, tenantId: string): Promise<ITag | null> {
        const tag = await this.repository.findById(id);
        if (!tag) throw new Error('Tag not found');

        // Verify Ownership
        if (!tag.organisation) {
            throw new Error('Cannot delete global tags');
        }

        if (tag.organisation.toString() !== tenantId) {
            throw new Error('You do not have permission to delete this tag');
        }

        return await this.repository.softDelete(id);
    }
}
