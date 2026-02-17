import { BusinessOrganisation } from '../entities/BusinessOrganisationModel';

export const seedOrganisations = async () => {
    try {
        console.log('Seeding Organisations...');

        // Clear existing Organisations
        await BusinessOrganisation.deleteMany({});

        const defaultOrg = await BusinessOrganisation.create({
            name: 'Acme Recruiting'
        });

        console.log(`Seeded Default Organisation: ${defaultOrg.name} (ID: ${defaultOrg._id})`);
        return defaultOrg;
    } catch (error) {
        console.error('Organisation Seeding Failed:', error);
        throw error;
    }
};
