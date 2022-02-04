import chai from 'chai';
import chaiHttp  from 'chai-http';
import assert from 'assert';

chai.use(chaiHttp);
const expect = chai.expect;
let tokenUser, tokenAdmin, user;

export default () => {
    describe(`Utilisateurs`, () => {
        // On récupére un admin et un utilisateur pour les tests
        before(async () => {
            await chai.request(process.env.URL_TEST_API)
                .get('/auth').set('x-api-key', process.env.API_KEY_ADMIN)
                .send().then((res) => { tokenAdmin = res.body.token; });
            
            await chai.request(process.env.URL_TEST_API)
                .get('/auth').set('x-api-key', process.env.API_KEY_USER)
                .send().then((res) => { tokenUser = res.body.token; });
        });

        
        /*************************************************************************
         **             Tests getAll     
         *************************************************************************/
        it(`Récupération de tout les utilisateurs avec un token role ADMIN`, async () => {
            await chai.request(process.env.URL_TEST_API)
                .get('/users').set('Authorization', `Bearer ${tokenAdmin}`)
                .send().then((res) => {
                    expect(res).to.have.status(200);
                });
        });

        it(`Récupération de tout les utilisateurs avec un token role USER`, async () => {
            await chai.request(process.env.URL_TEST_API)
                .get('/users').set('Authorization', `Bearer ${tokenUser}`)
                .send().then((res) => {
                    expect(res).to.have.status(403);
                });
        });


        /*************************************************************************
         **             Tests Insert     
         *************************************************************************/
         it(`Création d'un utilisateur avec un token role ADMIN`, async () => {
            await chai.request(process.env.URL_TEST_API)
                .post('/users')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send({
                    lastname: 'TestNomDefamille',
                    firstname: 'TestprenomDefamille',
                    email: 'newcontact@yopmail.com', 
                    password: 'test-password'
                }).then((res) => {
                    user = res.body;
                    expect(res).to.have.status(201);
                });
        });

        it(`Création d'un utilisateur email existant avec un token role ADMIN`, async () => {
            await chai.request(process.env.URL_TEST_API)
                .post('/users')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send({
                    lastname: 'TestNomDefamille',
                    firstname: 'TestprenomDefamille',
                    email: 'newcontact@yopmail.com', 
                    password: 'test-password'
                }).then((res) => {
                    assert.equal(res.body.error, `L'enregistrement de l'utilisateur a échoué.`);
                    expect(res).to.have.status(400);
                });
        });

        it(`Echec création d'un utilisateur avec un token role ADMIN`, async () => {
            await chai.request(process.env.URL_TEST_API)
                .post('/users')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send({}).then((res) => {
                    assert.equal(res.body.error, `L'enregistrement de l'utilisateur a échoué.`);
                    expect(res).to.have.status(400);
                });
        });

        it(`Création d'un utilisateur avec un token role USER`, async () => {
            await chai.request(process.env.URL_TEST_API)
                .post('/users')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('Authorization', `Bearer ${tokenUser}`)
                .send({}).then((res) => {
                    expect(res).to.have.status(403);
                });
        });


         /*************************************************************************
         **             Tests Update     
         *************************************************************************/
         it(`Modification d'un utilisateur avec un token role ADMIN`, async () => {
            await chai.request(process.env.URL_TEST_API)
                .put('/users/'+user._id)
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send({
                    lastname: 'TestNomDefamille',
                    firstname: 'TestprenomDefamille',
                    email: 'newcontact@yopmail.com'
                }).then((res) => {
                    expect(res).to.have.status(201);
                });
        });


        it(`Echec de modification d'un utilisateur ID inexistant`, async () => {
            await chai.request(process.env.URL_TEST_API)
                .put('/users/'+'123'+user._id.slice(1,3))
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send({
                    lastname: 'TestNomDefamille',
                    firstname: 'TestprenomDefamille',
                    email: 'newcontact2@yopmail.com'
                }).then((res) => {
                    assert.equal(res.body.error, `La demande n'est pas valide.`);
                    expect(res).to.have.status(400);
                });
        });

        it(`Echec de modification d'un ID incorrect`, async () => {
            await chai.request(process.env.URL_TEST_API)
                .put('/users/oups')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send({
                    lastname: 'TestNomDefamille',
                    firstname: 'TestprenomDefamille',
                    email: 'newcontact@yopmail.com'
                }).then((res) => {
                    assert.equal(res.body.error, `La demande n'est pas valide.`);
                    expect(res).to.have.status(400);
                });
        });

        it(`Modification d'un utilisateur avec un token role USER`, async () => {
            await chai.request(process.env.URL_TEST_API)
                .put('/users/'+user._id)
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('Authorization', `Bearer ${tokenUser}`)
                .send({
                    lastname: 'TestNomDefamille',
                    firstname: 'TestprenomDefamille',
                    email: 'newcontact@yopmail.com'
                }).then((res) => {
                    expect(res).to.have.status(403);
                });
        });

        /*************************************************************************
         **             Tests Delete     
        *************************************************************************/
         it(`Echec de suppression d'un utilisateur ID inexistant`, async () => {
            await chai.request(process.env.URL_TEST_API)
                .delete('/users/'+'123'+user._id.slice(1,3))
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send().then((res) => {
                    assert.equal(res.body.error, `La demande n'est pas valide.`);
                    expect(res).to.have.status(400);
                });
        });

        it(`Echec de suppression d'un ID incorrect`, async () => {
            await chai.request(process.env.URL_TEST_API)
                .delete('/users/oups')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send().then((res) => {
                    assert.equal(res.body.error, `La demande n'est pas valide.`);
                    expect(res).to.have.status(400);
                });
        });

        it(`Suppression d'un utilisateur avec un token role USER`, async () => {
            await chai.request(process.env.URL_TEST_API)
                .delete('/users/'+user._id)
                .set('Authorization', `Bearer ${tokenUser}`)
                .send({
                    lastname: 'TestNomDefamille',
                    firstname: 'TestprenomDefamille',
                    email: 'newcontact@yopmail.com'
                }).then((res) => {
                    expect(res).to.have.status(403);
                });
        });


        it(`Suppression d'un utilisateur avec un token role ADMIN`, async () => {
            await chai.request(process.env.URL_TEST_API)
                .put('/users/'+user._id)
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send({
                    lastname: 'TestNomDefamille',
                    firstname: 'TestprenomDefamille',
                    email: 'newcontact@yopmail.com'
                }).then((res) => {
                    expect(res).to.have.status(201);
                });
        });
    });
};