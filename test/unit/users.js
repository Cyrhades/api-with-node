import assert from 'assert';
import Repo from '../../src/repository/repository.users.js';
const UserRepo = new Repo();
let user, admin;
export default () => {

    describe('Tests utilisateurs', () => {
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

        /*************************************************************************
         **             Tests par findById       
         *************************************************************************/
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


        /*************************************************************************
         **             Tests count     
         *************************************************************************/
        it(`Nombre d'utilisateur`, async () => {
            await UserRepo.count()
                .then((result)=> { 
                    assert.equal(result, 20);                    
                });      
        });

        it(`Nombre d'utilisateur avec un filtre`, async () => {
            await UserRepo.count({_id: user.id})
                .then((result)=> { 
                    assert.equal(result, 1);                    
                }); 
            await UserRepo.count({ email: user.email })
                .then((result)=> { 
                    assert.equal(result, 1);                    
                });        
        });


        /*************************************************************************
         **             Tests getAll     
         *************************************************************************/
        it(`Récupération de tout les utilisateurs`, async () => {
            await UserRepo.getAll()
                .then((records)=> { 
                    assert.equal(records.length, 20);                    
                });      
        });
       
        it(`Récupération d'un seul utilisateur via une limite`, async () => {
            await UserRepo.getAll({roles: 'ADMIN'}, 'roles email apiKey',{ limit: 1 })
                .then((records)=> { 
                    assert.equal(records[0].id, admin.id);
                    assert.equal(records[0].email, admin.email);
                    assert.equal(records[0].apiKey, admin.apiKey);
                    assert.equal(records.length, 1);                    
                });
        });

        it(`Récupération d'un seul utilisateur via un filtre`, async () => {
            await UserRepo.getAll({_id: admin.id})
                .then((records)=> { 
                    assert.equal(records[0].id, admin.id);
                    assert.equal(records[0].email, admin.email);
                    assert.equal(records[0].apiKey, admin.apiKey);
                    assert.equal(records.length, 1);                
                });      
        });


        /*************************************************************************
         **             Tests Insert     
         *************************************************************************/
        it(`Insertion d'un utilisateur`, async () => {
            await UserRepo.insert({
                lastname: 'TestNomDefamille',
                firstname: 'TestprenomDefamille',
                email: 'test@yopmail.com', 
                password: 'test-password',
                apiKey: '9E8F7D-F8E9-4F7B-9F8D-F8E9F7D4F7B9',
            }).then((record)=> {
                assert.equal(record.email, 'test@yopmail.com');
                assert.equal(record.roles.length, 1);    // ['USER']        
            });
        });

        it(`Echec d'insertion d'un utilisateur`, async () => {
            await UserRepo.insert({
                lastname: 'TestNomDefamille',
                firstname: 'TestprenomDefamille',
                email: admin.email, 
                password: 'test-password',
                apiKey: '9E8F7D-F8E9-4F7B-9F8D-F8E9F7D4F7B9',
             })
            .then().catch((err) => { 
                assert.equal(err, `La création de l'utilisateur a échoué.`);                    
            });      
        });
       
     
        /*************************************************************************
         **             Tests Update     
         *************************************************************************/
        it(`Modification d'un utilisateur`, async () => {
            await UserRepo.update(admin.id, {
                lastname: 'TestNomDefamille',
                firstname: 'TestprenomDefamille'
            }).then((record)=> {
                assert.equal(record.lastname, 'TestNomDefamille');
                assert.equal(record.firstname, 'TestprenomDefamille');       
            });
        });
        
        it(`Echec de modification d'un utilisateur`, async () => {
            await UserRepo.update(admin.id, {
                lastname: 'TestNomDefamille',
                firstname: 'TestprenomDefamille',
                email: user.email
            }).then().catch((err) => { 
                assert.equal(err, `La modification de l'utilisateur a échoué.`);                    
            });    
        });
        
        it(`Echec de modification d'un utilisateur ID inexistant`, async () => {
            await UserRepo.update('123'+admin.id.slice(1,3), {
                lastname: 'TestNdomDefamille',
                firstname: 'TestdprenomDefamille',
                email: user.email
            }).then().catch((err) => { 
                assert.equal(err, `La modification de l'utilisateur a échoué.`);                    
            });    
        });

        /*************************************************************************
         **             Tests Delete     
         *************************************************************************/
        it(`Suppression d'un utilisateur`, async () => {
            // On commence par créer un utilisateur pour le supprimer
            await UserRepo.insert({
                lastname: 'newuser',
                firstname: 'newuser',
                email: 'newuser@yopmail.com', 
                password: 'test-password',
                apiKey: '9E8F7D-F8E9-4F7B-9F8D-F8E9F7D4F778',
            }).then(async (record)=> {
                await UserRepo.delete(record.id).then((msg) => { 
                    assert.equal(msg, `L'utilisateur a été supprimé.`);                 
                });
            });
        });

        it(`Echec de suppression avec ID inexistant`, async () => {
            await UserRepo.delete('123'+admin.id.slice(1,3)).then().catch((err) => { 
                assert.equal(err, `L'utilisateur n'existe pas.`);                    
            });
        });
    });
};