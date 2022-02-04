import Auth from './auth.js';
import Users from './users.js';
//import Contacts from './contacts.js';

export default () => {
   
    describe(`🐾 Tests unitaires de l'API`, () => {
        describe('🔑 Authentification', Auth.bind(this));

        describe('🧑‍💻 Utilisateurs', Users.bind(this));

        //describe('👥 Contacts', Contacts.bind(this));

        after(function() {
            // @todo : detect error mocha
            console.log(`Todo : Inutile de faire les tests Fonctionnels si il y a déjà des erreurs dans les tests Unitaires`);
        });
    });

};