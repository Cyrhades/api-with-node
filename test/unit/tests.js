import Auth from './auth.js';
import Users from './users.js';
import Contacts from './contacts.js';

export default () => {
   
    describe(`ð¾ Tests unitaires de l'API`, () => {
        describe('ð Authentification', Auth.bind(this));

        describe('ð§âð» Utilisateurs', Users.bind(this));

        describe('ð¥ Contacts', Contacts.bind(this));

        after(function() {
            // @todo : detect error mocha
            console.log(`Todo : Inutile de faire les tests Fonctionnels si il y a dÃ©jÃ  des erreurs dans les tests Unitaires`);
        });
    });

};