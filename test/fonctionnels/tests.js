import Auth from './auth.js';
import Users from './users.js';

export default () => {
    describe(`🌍 Tests Fonctionnels de l'API`, function() {
        describe('🔑 Authentification Api', Auth.bind(this));

        describe('🧑‍💻 Utilisateurs', Users.bind(this));
    });
};