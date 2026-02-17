import mongoose from 'mongoose';
import { Tag } from '../entities/TagModel';
import { TagColor } from '../entities/TagColorModel';
import { BusinessOrganisation } from '../entities/BusinessOrganisationModel';
import dotenv from 'dotenv';
import { connectDB } from '../config/db';

dotenv.config();

const candidateTags = [
    { name: 'Available', color: '#eb5a46' },
    { name: 'Blacklisted', color: '#eb5a46' },
    { name: 'Foreigner', color: '#c377e0' },
    { name: 'Important', color: '#61bd4f' },
    { name: 'Open to relocation', color: '#ff9f1a' },
    { name: 'Recently placed', color: '#344563' },
    { name: 'Remote', color: '#ffd5a4' },
    { name: 'VIP', color: '#61bd4f' }
];

const clientTags = [
    { name: 'Few vacancies', color: '#eb5a46' },
    { name: 'Good', color: '#eb5a46' },
    { name: 'Important', color: '#c377e0' },
    { name: 'International', color: '#61bd4f' },
    { name: 'Late payment', color: '#ff9f1a' },
    { name: 'Many vacancies', color: '#344563' },
    { name: 'Multinational', color: '#ffd5a4' },
    { name: 'Start-up', color: '#61bd4f' }
];

const jobTags = [
    { name: 'Business Critical', color: '#eb5a46' },
    { name: 'Confidential', color: '#eb5a46' },
    { name: 'Critical', color: '#c377e0' },
    { name: 'custom tag', color: '#61bd4f' },
    { name: 'High Priority', color: '#ff9f1a' },
    { name: 'Important', color: '#344563' },
    { name: 'Low Priority', color: '#ffd5a4' },
    { name: 'Medium Priority', color: '#61bd4f' }
];

const commonColors = [
    '#61bd4f', '#f2d600', '#ff9f1a', '#eb5a46',
    '#c377e0', '#0079bf', '#00c2e0', '#51e898',
    '#ff78cb', '#344563', '#b3d94c', '#b3bac5',
    '#ff0000', '#ffd5a4'
];

export const seedTags = async (organisationId?: string) => {
    try {
        console.log('Seeding Tags...');

        // 1. Clear existing Tags and Colors
        await Tag.deleteMany({});
        await TagColor.deleteMany({});
        console.log('Cleared existing Tags and TagColors.');

        // 2. Insert Default Colors (Global)
        const colorDocs: any[] = [];
        const entityTypes = ['candidate', 'client', 'job'] as const;

        const colorMap = new Map<string, mongoose.Types.ObjectId>();

        for (const type of entityTypes) {
            for (const color of commonColors) {
                const newColor = new TagColor({
                    color: color,
                    entityType: type,
                    organisation: null // Keep colors global
                });
                colorDocs.push(newColor);
                colorMap.set(`${color}_${type}`, newColor._id as mongoose.Types.ObjectId);
            }
        }
        await TagColor.insertMany(colorDocs);
        console.log(`Seeded ${colorDocs.length} TagColors.`);

        // 3. Insert Default Tags
        const tagDocs: any[] = [];

        const processTags = async (tags: any[], type: 'candidate' | 'client' | 'job') => {
            for (const t of tags) {
                let colorId = colorMap.get(`${t.color}_${type}`);

                if (!colorId) {
                    const newColor = await TagColor.create({
                        color: t.color,
                        entityType: type as any,
                        organisation: null
                    });
                    colorId = newColor._id as mongoose.Types.ObjectId;
                    colorMap.set(`${t.color}_${type}`, colorId);
                }

                tagDocs.push({
                    name: t.name,
                    color: colorId,
                    entityType: type,
                    organisation: null // Seeded tags are now global
                });
            }
        };

        await processTags(candidateTags, 'candidate');
        await processTags(clientTags, 'client');
        await processTags(jobTags, 'job');

        await Tag.insertMany(tagDocs);
        console.log(`Seeded ${tagDocs.length} Global Tags.`);

        console.log('Tags Seeding Complete.');
    } catch (error) {
        console.error('Tags Seeding Failed:', error);
        throw error;
    }
};
