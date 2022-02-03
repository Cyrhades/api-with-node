import Auth from './auth.js';

export default () => {
    describe(`🌍 Tests Fonctionnels de l'API`, function() {
        describe('🔑 Authentification Api', Auth.bind(this));
    });
};