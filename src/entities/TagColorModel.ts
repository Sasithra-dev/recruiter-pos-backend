import mongoose, { Schema, Document } from 'mongoose';

export interface ITagColor extends Document {
    color: string;
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

const tagColorSchema: Schema = new Schema({
    color: {
        type: String,
        required: true,
        match: /^#([0-9a-f]{3}|[0-9a-f]{6})$/i
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

// Prevent duplicate colors for same scope
tagColorSchema.index({ color: 1, entityType: 1, organisation: 1 }, { unique: true });

export const TagColor = mongoose.model<ITagColor>('TagColor', tagColorSchema);
