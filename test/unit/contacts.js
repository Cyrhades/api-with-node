import assert from 'assert';
import Repo from '../../src/repository/repository.contacts.js';
const ContactRepo = new Repo();
let contact;
export default () => {

    describe('Tests contacts', () => {
        // On récupére un contact pour les tests
        before( async () => {            
            await ContactRepo.getAll({}, null, { limit: 1 }).then((record)=> { 
                contact = record[0]; 
            }); 
        });

        /*************************************************************************
         **         Tests par findById       
         *************************************************************************/
        it('Contact par son ID ', async () => {
            await ContactRepo.findById(contact.id)
                .then((record)=> {
                    assert.equal(record.id, contact.id);
                    assert.equal(record.email, contact.email);
                });      
        });

        it('ID inexistant', async () => {
            await ContactRepo.findById('61fbccbc7172b2b447ba9527')
                .then().catch((err)=> { 
                    assert.equal(err, `Le contact n'existe pas.`);                    
                });      
        });

        it('ID incorrecte', async () => {
            await ContactRepo.findById('123456789')
                .then().catch((err)=> { 
                    assert.equal(err, `La demande n'est pas valide.`);                    
                });      
        });


        /*************************************************************************
         **             Tests count     
         *************************************************************************/
        it(`Nombre de contact`, async () => {
            await ContactRepo.count()
                .then((result)=> { 
                    assert.equal(result, 20);                    
                });      
        });

        it(`Nombre de contact avec un filtre`, async () => {
            await ContactRepo.count({_id: contact.id})
                .then((result)=> { 
                    assert.equal(result, 1);                    
                }); 
            await ContactRepo.count({ email: contact.email })
                .then((result)=> { 
                    assert.equal(result, 1);                    
                });        
        });


        /*************************************************************************
         **             Tests getAll     
         *************************************************************************/
        it(`Récupération de tout les contacts`, async () => {
            await ContactRepo.getAll()
                .then((records)=> { 
                    assert.equal(records.length, 20);                    
                });      
        });
       
        it(`Récupération d'un seul contact via une limite`, async () => {
            await ContactRepo.getAll({}, 'firstname lastname email',{ limit: 1 })
                .then((records)=> { 
                    assert.equal(records[0].id, contact.id);
                    assert.equal(records[0].firstname, contact.firstname);
                    assert.equal(records[0].lastname, contact.lastname);
                    assert.equal(records.length, 1);                    
                });
        });

        it(`Récupération d'un seul contact via un filtre`, async () => {
            await ContactRepo.getAll({_id: contact.id})
                .then((records)=> { 
                    assert.equal(records[0].id, contact.id);
                    assert.equal(records[0].firstname, contact.firstname);
                    assert.equal(records[0].lastname, contact.lastname);
                    assert.equal(records.length, 1);                 
                });      
        });


        /*************************************************************************
         **             Tests Insert     
         *************************************************************************/
        it(`Insertion d'un contact`, async () => {
            await ContactRepo.insert({
                civility: 'Monsieur',
                lastname: 'TestNomDefamille',
                firstname: 'TestprenomDefamille',
                phone: '0123456789',
                email: 'test@yopmail.com',
                info: 'Test Info'
            }).then((record)=> {
                assert.equal(record.email, 'test@yopmail.com');   
            });
        });

        it(`Echec d'insertion d'un contact`, async () => {
            await ContactRepo.insert({
                civility: 'Monsieur',
                lastname: 'TestNomDefamille',
                firstname: 'TestprenomDefamille',
                phone: '0123456789',
                email: contact.email,
                info: 'Test Info'
             })
            .then().catch((err) => { 
                assert.equal(err, `La création de le contact a échoué.`);                    
            });      
        });
       
     
        /*************************************************************************
         **             Tests Update     
         *************************************************************************/
        it(`Modification d'un contact`, async () => {
            await ContactRepo.update(contact.id, {
                lastname: 'TestNomDefamille',
                firstname: 'TestprenomDefamille'
            }).then((record)=> {
                assert.equal(record.lastname, 'TestNomDefamille');
                assert.equal(record.firstname, 'TestprenomDefamille');       
            });
        });
        
        it(`Echec de modification d'un contact`, async () => {
            await ContactRepo.update(contact.id, {
                lastname: 'TestNomDefamille',
                firstname: 'TestprenomDefamille',
                email: contact.email
            }).then().catch((err) => { 
                assert.equal(err, `La modification du contact a échoué.`);                    
            });    
        });

        it(`Echec de modification d'un utilisateur ID inexistant`, async () => {
            await ContactRepo.update('0'+contact.id.slice(1), {
                lastname: 'TestNdomDefamille',
                firstname: 'TestdprenomDefamille',
                email: contact.email
            }).then().catch((err) => { 
                assert.equal(err, `La modification du contact a échoué.`);                    
            });    
        });
        
        /*************************************************************************
         **             Tests Delete     
         *************************************************************************/
        it(`Suppression d'un contact`, async () => {
            // On commence par créer un contact pour le supprimer
            await ContactRepo.insert({
                lastname: 'newuser',
                firstname: 'newuser',
                email: 'newuser@yopmail.com', 
                password: 'test-password',
                apiKey: '9E8F7D-F8E9-4F7B-9F8D-F8E9F7D4F778',
            }).then(async (record)=> {
                await ContactRepo.delete(record.id).then((msg) => { 
                    assert.equal(msg, `Le contact a été supprimé.`);                 
                });
            });
        });

        it(`Echec de suppression avec ID inexistant`, async () => {
            await ContactRepo.delete('0'+contact.id.slice(1)).then().catch((err) => { 
                assert.equal(err, `Le contact n'existe pas.`);                    
            });
        });
    });
};