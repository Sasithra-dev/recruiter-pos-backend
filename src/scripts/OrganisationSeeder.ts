import { Organisation } from '../entities/OrganisationModel';

export const seedOrganisations = async () => {
    try {
        console.log('Seeding Organisations...');

        // Clear existing Organisations
        await Organisation.deleteMany({});

        const defaultOrg = await Organisation.create({
            name: 'Acme Recruiting'
        });

        console.log(`Seeded Default Organisation: ${defaultOrg.name} (ID: ${defaultOrg._id})`);
        return defaultOrg;
    } catch (error) {
        console.error('Organisation Seeding Failed:', error);
        throw error;
    }
};
