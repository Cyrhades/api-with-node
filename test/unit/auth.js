import assert from 'assert';
import app from '../../index.js';
import Repo from '../../src/repository/repository.users.js';
const UserRepo = new Repo();

export default () => {
    describe('Recherche User Email et password', () => {
        it('Email et mot de passe ADMIN corrects', async () => {
            await UserRepo.findByEmailAndPassword(process.env.ACCOUNT_ADMIN_EMAIL, process.env.ACCOUNT_PWD)
            .then((record)=> {
                assert.equal(record.email, process.env.ACCOUNT_ADMIN_EMAIL);
                assert.deepEqual(record.roles, ['USER', 'ADMIN']);
            });      
        });

        it('Email et mot de passe USER corrects', async () => {
            await UserRepo.findByEmailAndPassword(process.env.ACCOUNT_USER_EMAIL, process.env.ACCOUNT_PWD)
            .then((record)=> {
                assert.equal(record.email, process.env.ACCOUNT_USER_EMAIL);
                assert.deepEqual(record.roles, ['USER']);
            });      
        });
    });
};