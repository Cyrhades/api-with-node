import assert from 'assert';
import Repo from '../../src/repository/repository.users.js';
const UserRepo = new Repo();
let user, admin;
export default () => {

    describe('Tests utilisateur', () => {
        // On récupére un admin et un utilisateur pour les tests
        before( async () => {
            await UserRepo.findByEmailAndPassword(process.env.ACCOUNT_USER_EMAIL, process.env.ACCOUNT_PWD)
            .then((record)=> {
                user = record;
            });   
            await UserRepo.findByEmailAndPassword(process.env.ACCOUNT_ADMIN_EMAIL, process.env.ACCOUNT_PWD)
            .then((record)=> {
                admin = record;
            }); 
        });


        it('Admin par son ID ', async () => {
            await UserRepo.findById(admin.id)
                .then((record)=> {
                    assert.equal(record.id, admin.id);
                    assert.equal(record.email, admin.email);
                    assert.equal(record.apiKey, admin.apiKey);
                });      
        });

        it('Utilisateur par son ID ', async () => {
            await UserRepo.findById(user.id)
                .then((record)=> {
                    assert.equal(record.id, user.id);
                    assert.equal(record.email, user.email);
                    assert.equal(record.apiKey, user.apiKey);
                });      
        });

        it('ID inexistant', async () => {
            await UserRepo.findById('61fbccbc7172b2b447ba9527')
                .then().catch((err)=> { 
                    assert.equal(err, `L'utilisateur n'existe pas.`);                    
                });      
        });

        it('ID incorrecte', async () => {
            await UserRepo.findById('123456789')
                .then().catch((err)=> { 
                    assert.equal(err, `La demande n'est pas valide.`);                    
                });      
        });
    });
};