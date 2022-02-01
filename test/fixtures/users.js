import mongoose from 'mongoose';
import faker from '@faker-js/faker';

export default {
    empty : function async ()  {
        mongoose.connection.collections['users'].drop();
        return this
    },
    users : async (nb) => {
        const Schema = (await import('../../api/users/schema.js')).default;
        const uuidAPIKey = (await import('uuid-apikey')).default;
        const bcrypt = (await import('bcryptjs')).default;

        // Pour chaque utilisateur à créer
        for(let i = 1; i <= nb; i++) {
            let apiKey = uuidAPIKey.create().apiKey;
            let email = faker.faker.internet.email();
            let roles = ['USER'];
            // On initialise les infos du premier utilisateur
            if(i === 1) {
                process.env.API_KEY = apiKey;
                process.env.ACCOUNT_EMAIL = email;
                process.env.ACCOUNT_PWD = '123456';
                roles = ['USER', 'ADMIN'];
            }
            // On hash le mot de passe
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync('123456', salt);
            // On enregistre l'utilisateur
            await new Schema({
                lastname: faker.faker.name.lastName(),
                firstname: faker.faker.name.firstName(),
                email: email,
                password: hash,
                apiKey: apiKey,
                roles: roles
            }).save();
        }
    }
};
