import mongoose, { Model, Document, QueryOptions } from 'mongoose';

// Fallback for missing types in newer Mongoose versions
type FilterQuery<T> = any;
type UpdateQuery<T> = any;

export interface IPageResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }
}

export abstract class BaseRepository<T extends Document> {
    public readonly model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async create(data: Partial<T>): Promise<T> {
        return await this.model.create(data);
    }

    async findOne(filter: FilterQuery<T>, projection?: any, options?: QueryOptions): Promise<T | null> {
        return await this.model.findOne(filter, projection, options).exec();
    }

    async findById(id: string, projection?: any, options?: QueryOptions & { populate?: any }): Promise<T | null> {
        let query = this.model.findById(id, projection, options);
        if (options?.populate) {
            query = query.populate(options.populate);
        }
        return await query.exec();
    }

    async findAll(
        filter: FilterQuery<T> = {},
        page: number = 1,
        limit: number = 20,
        sort: any = { createdAt: -1 },
        populate?: any
    ): Promise<IPageResult<T>> {
        const safeLimit = Math.min(limit, 100);
        const skip = (page - 1) * safeLimit;

        let query = this.model.find(filter).limit(safeLimit).skip(skip).sort(sort);

        if (populate) {
            query = query.populate(populate);
        }

        const data = await query.exec();
        const total = await this.model.countDocuments(filter).exec();
        const totalPages = Math.ceil(total / safeLimit);

        return {
            data,
            pagination: {
                page,
                limit: safeLimit,
                total,
                totalPages
            }
        };
    }

    async update(id: string, update: UpdateQuery<T>, options: QueryOptions = { new: true }): Promise<T | null> {
        return await this.model.findByIdAndUpdate(id, update, options).exec();
    }

    async updateMany(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<any> {
        return await this.model.updateMany(filter, update).exec();
    }

    async delete(id: string): Promise<T | null> {
        return await this.model.findByIdAndDelete(id).exec();
    }

    async softDelete(id: string): Promise<T | null> {
        return await this.model.findByIdAndUpdate(id, { active: false } as any, { new: true }).exec();
    }
}
