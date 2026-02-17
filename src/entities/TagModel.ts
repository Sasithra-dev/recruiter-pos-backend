import mongoose, { Schema, Document } from 'mongoose';

export interface ITag extends Document {
    name: string;
    description?: string;
    color: mongoose.Types.ObjectId;
    entityType: 'candidate' | 'client' | 'job';
    organisation: mongoose.Types.ObjectId | null;
    active: boolean;
    auditInfo: {
        createdAt: Date;
        createdBy: string;
        updatedAt: Date;
        updatedBy: string;
    };
}

const tagSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    color: {
        type: Schema.Types.ObjectId,
        ref: 'TagColor',
        required: true
    },
    entityType: {
        type: String,
        enum: ['candidate', 'client', 'job'],
        required: true
    },
    organisation: {
        type: Schema.Types.ObjectId,
        ref: 'BusinessOrganisation',
        default: null
    },
    active: {
        type: Boolean,
        default: true
    },
    auditInfo: {
        createdAt: Date,
        createdBy: String,
        updatedAt: Date,
        updatedBy: String
    }
}, {
    timestamps: {
        createdAt: 'auditInfo.createdAt',
        updatedAt: 'auditInfo.updatedAt'
    }
});

// Prevent duplicate tag names within an org/type
tagSchema.index({ name: 1, entityType: 1, organisation: 1 }, { unique: true });

export const Tag = mongoose.model<ITag>('Tag', tagSchema);
