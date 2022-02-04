import chai from 'chai';
import chaiHttp  from 'chai-http';
import assert from 'assert';

chai.use(chaiHttp);
const expect = chai.expect;
let tokenUser, tokenAdmin;

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
                    expect(res).to.have.status(201);
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
    });
};