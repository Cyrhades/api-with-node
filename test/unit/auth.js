import assert from 'assert';
import Repo from '../../src/repository/repository.users.js';
const UserRepo = new Repo();

export default () => {
    // Tests Avec email Mot de passe
    describe('Recherche utilisateur Email et password', () => {
        it('Admin, mot de passe correct', async () => {
            await UserRepo.findByEmailAndPassword(process.env.ACCOUNT_ADMIN_EMAIL, process.env.ACCOUNT_PWD)
            .then((record)=> {
                assert.equal(record.email, process.env.ACCOUNT_ADMIN_EMAIL);
                assert.deepEqual(record.roles, ['USER', 'ADMIN']);
            });      
        });

        it('Admin, mot de passe incorrect', async () => {
            await UserRepo.findByEmailAndPassword(process.env.ACCOUNT_ADMIN_EMAIL, 'oups')
            .then().catch((err)=> {
                assert.equal(err, `L'authentification a échoué.`);
            });      
        });

        it('User, mot de passe correct', async () => {
            await UserRepo.findByEmailAndPassword(process.env.ACCOUNT_USER_EMAIL, process.env.ACCOUNT_PWD)
            .then((record)=> {
                assert.equal(record.email, process.env.ACCOUNT_USER_EMAIL);
                assert.deepEqual(record.roles, ['USER']);
            });      
        });

        it('User, mot de passe incorrect', async () => {
            await UserRepo.findByEmailAndPassword(process.env.ACCOUNT_USER_EMAIL, 'oups')
            .then().catch((err)=> {
                assert.equal(err, `L'authentification a échoué.`);
            });       
        });

        it('email inexistant', async () => {
            await UserRepo.findByEmailAndPassword('oups@oups.fr', 'oups')
            .then().catch((err)=> {
                assert.equal(err, `L'authentification a échoué.`);
            });      
        });
    });

    // Tests Avec email Mot de passe
    describe('Recherche utilisateur clé API', () => {
        it('Admin, clé API correcte', async () => {
            await UserRepo.findByApiKey(process.env.API_KEY_ADMIN)
            .then((record)=> {
                assert.equal(record.email, process.env.ACCOUNT_ADMIN_EMAIL);
                assert.deepEqual(record.roles, ['USER', 'ADMIN']);
            });      
        });

        it('User, clé API correcte', async () => {
            await UserRepo.findByApiKey(process.env.API_KEY_USER)
            .then((record)=> {
                assert.equal(record.email, process.env.ACCOUNT_USER_EMAIL);
                assert.deepEqual(record.roles, ['USER']);
            });      
        });

        it('clé API incorrecte', async () => {
            await UserRepo.findByApiKey('oups')
            .then().catch((err)=> {
                assert.equal(err, `La clé API n'existe pas.`);
            });       
        });

        it('clé API inexistante', async () => {
            await UserRepo.findByApiKey('0'+process.env.API_KEY_ADMIN.slice(1))
            .then().catch((err)=> {
                assert.equal(err, `La clé API n'existe pas.`);
            });      
        });
    });
};