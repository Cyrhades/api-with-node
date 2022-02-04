import mongoose from 'mongoose';
import faker from '@faker-js/faker';

export default {
    empty : function async ()  {
        mongoose.connection.collections['contacts'].drop();
        return this
    },
    create : async (nb) => {
        const Schema = (await import('../../src/repository/schema/contacts.js')).default;

        // Pour chaque utilisateur à créer
        for(let i = 0; i < nb; i++) {
            // On enregistre l'utilisateur
            await new Schema({
                civility: faker.faker.name.title(),
                lastname: faker.faker.name.lastName(),
                firstname: faker.faker.name.firstName(),
                phone: faker.faker.phone.phoneNumber(),
                email: faker.faker.internet.email().toLowerCase(),
                info: faker.faker.lorem.paragraphs()
            }).save((err, records) => {
                if (!err) {
                    if(i === 1) {
                        process.env.ACCOUNT_ADMIN_ID = records.id;
                    } else if(i === 2) {
                        process.env.ACCOUNT_USER_ID = records.id;
                    }
                }
            });            
        }
    }
};
