import { connectDB } from '../config/db';
import { seedTags } from './TagSeeder';
import { seedOrganisations } from './OrganisationSeeder';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const runSeeders = async () => {
    try {
        console.log('Starting Database Seeder...');
        await connectDB();

        // Execute Seeders
        await seedOrganisations();
        await seedTags();

        // Future seeders can be added here
        // await seedUsers();
        // await seedOrganisations();

        console.log('All Seeders Completed Successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Seeding Process Failed:', error);

        // Close connection on error if it's open, though process.exit usually handles cleanup
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
        process.exit(1);
    }
};

runSeeders();
