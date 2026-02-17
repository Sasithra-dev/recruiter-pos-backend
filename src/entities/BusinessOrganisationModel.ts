import mongoose, { Schema, Document } from 'mongoose';

export interface IBusinessOrganisation extends Document {
    name: string;
}

const businessOrganisationSchema: Schema = new Schema({
    name: { type: String, required: true }
}, { timestamps: true });

export const BusinessOrganisation = mongoose.model<IBusinessOrganisation>('BusinessOrganisation', businessOrganisationSchema);
