import mongoose, { Schema, Document } from 'mongoose';

export interface IOrganisation extends Document {
    name: string;
}

const organisationSchema: Schema = new Schema({
    name: { type: String, required: true }
}, { timestamps: true });

export const Organisation = mongoose.model<IOrganisation>('Organisation', organisationSchema);
